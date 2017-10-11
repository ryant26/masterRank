const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const mockHelpers = require('../../commonUtils/mockingHelpers');
const mockData = require('../../commonUtils/mockOverwatchData');
const tokenGenerator = require('../../../../devTools/tokenHelpers');

const server = require('../../../../src/app');
const Player = require('../../../../src/models/Player');

chai.use(chaiHttp);

let getPlayerQueryObj = function (token = mockHelpers.token) {
    return {
        platformDisplayName: token.battleNetId,
        region: token.region,
        platform: token.platform
    };
};

let makeGetAuthenticationRequest = function(url = '/auth/bnet/callback') {
    return verifySuccessResponse(chai.request(server).get(url));

};

let makePostAuthenticationRequest = function(platform, username, password) {
    return verifySuccessResponse(chai.request(server).post(`/auth/${platform}/callback`).send({
        username,
        password
    }));

};

let verifySuccessResponse = function(request) {
    return request
        .query({region: mockHelpers.token.region})
        .redirects(0)
        .then(Promise.reject)
        .catch((err) => {
            let response = err.response;
            assert.equal(err.response.status, 302);
            assert.equal(err.response.headers.location, '/');
            assert.isTrue(err.response.headers['set-cookie'][0].startsWith('access_token='));
            return response;
        });
};


let verifyFailureResponse = function(request) {
    return request
        .query({region: mockHelpers.token.region})
        .redirects(0)
        .then(Promise.reject)
        .catch((err) => {
            let response = err.response;
            assert.equal(err.response.status, 302);
            assert.equal(err.response.headers.location, '/?failedLogin=true');
            return response;
        });
};


let testNewUserCreated = function(requestFunction, queryObject) {
    return Player.findOne(getPlayerQueryObj()).then((result) => {
        assert.isNull(result);
        return requestFunction();
    }).then(() => {
        return Player.findOne(queryObject);
    }).then((result) => {
        assert.equal(result.level, mockData.playerDetails.level);
    });
};

let testUserUpdated = function (requestFunction, queryObject) {
    let date = new Date();
    date.setHours(date.getHours() - 7);

    let playerConfig = {
        platformDisplayName: mockHelpers.token.battleNetId,
        platform: mockHelpers.token.platform,
        lastUpdated: date,
        level: 100,
        portrait: 'Some portrait link',
        region: mockHelpers.token.region,
        skillRating: 2500
    };

    return new Player(playerConfig).save().then(() => {
        return requestFunction();
    }).then(() => {
        return Player.findOne(queryObject);
    }).then((result) => {
        assert.equal(result.level, mockData.playerDetails.level);
        assert.notEqual(playerConfig.level, mockData.playerDetails.level);
    });
};

describe('battleNetAuthenticator', function() {

    before(function() {
        mockHelpers.stubBnetAuth();
        mockHelpers.stubOverwatchAPI();
        return Player.remove({});
    });

    afterEach(function() {
        return Player.remove({});
    });

    after(function () {
        mockHelpers.restoreAllStubs();
    });

    it('should create the user on new login', function() {
        return testNewUserCreated(makeGetAuthenticationRequest, getPlayerQueryObj());
    });

    it('should update older users', function() {
        return testUserUpdated(makeGetAuthenticationRequest, getPlayerQueryObj());
    });

    it('should redirect with query param on failure', function() {
        return verifyFailureResponse(chai.request(server).get('/auth/bnet/callback')
            .query({accessCode: mockHelpers.bnetFailureCode}));
    });
});

describe('xblAuthenticator', function() {
    let postReqFunc = function () {
        return makePostAuthenticationRequest('xbl', mockHelpers.token.battleNetId, 'password');
    };

    before(function() {
        mockHelpers.stubOverwatchAPI();
        return Player.remove({});
    });

    afterEach(function() {
        return Player.remove({});
    });

    after(function () {
        mockHelpers.restoreAllStubs();
    });

    it('should create the user on new login', function() {
        return testNewUserCreated(postReqFunc, getPlayerQueryObj({
            battleNetId: mockHelpers.token.battleNetId,
            platform: 'xbl',
            region: mockHelpers.token.region
        }));
    });

    it('should update older users', function() {
        return testUserUpdated(postReqFunc, getPlayerQueryObj({
            battleNetId: mockHelpers.token.battleNetId,
            platform: 'xbl',
            region: mockHelpers.token.region
        }));
    });

    it('should redirect with query param on failure', function() {
        return verifyFailureResponse(chai.request(server).post('/auth/xbl/callback'));
    });
});

describe('psnAuthenticator', function() {
    let postReqFunc = function () {
        return makePostAuthenticationRequest('psn', mockHelpers.token.battleNetId, 'password');
    };

    before(function() {
        mockHelpers.stubOverwatchAPI();
        return Player.remove({});
    });

    afterEach(function() {
        return Player.remove({});
    });

    after(function () {
        mockHelpers.restoreAllStubs();
    });

    it('should create the user on new login', function() {
        return testNewUserCreated(postReqFunc, getPlayerQueryObj({
            battleNetId: mockHelpers.token.battleNetId,
            platform: 'psn',
            region: mockHelpers.token.region
        }));
    });

    it('should update older users', function() {
        return testUserUpdated(postReqFunc, getPlayerQueryObj({
            battleNetId: mockHelpers.token.battleNetId,
            platform: 'psn',
            region: mockHelpers.token.region
        }));
    });

    it('should redirect with query param on failure', function() {
        return verifyFailureResponse(chai.request(server).post('/auth/psn/callback'));
    });
});

describe('tokenAuthenticator', function() {
    let battleNetId = 'testUser#1234';
    let region = 'us';
    let platform = 'pc';

    it('should reject expired tokens', function() {
        let expiredToken = tokenGenerator.getExpiredToken(battleNetId, region, platform);
        return chai.request(server)
            .post('/auth/token/validate')
            .send({token: expiredToken})
            .then(() => {
                throw new Error('Should be unauthorized');
            })
            .catch((err) => {
                assert.equal(err.status, 401);
                assert.equal(err.message, 'Unauthorized');
            });
    });

    it('should reject invalid requests', function() {
        return chai.request(server)
            .post('/auth/token/validate')
            .then(() => {
                throw new Error('Should be bad request');
            })
            .catch((err) => {
                assert.equal(err.status, 400);
                assert.equal(err.message, 'Bad Request');
            });
    });

    it('should reject tokens signed with the wrong secret', function() {
        let badToken = tokenGenerator.getTokenSignedWithOldSecret(battleNetId, region, platform);
        return chai.request(server)
            .post('/auth/token/validate')
            .send({token: badToken})
            .then(() => {
                throw new Error('Should be unauthorized');
            })
            .catch((err) => {
                assert.equal(err.status, 401);
                assert.equal(err.message, 'Unauthorized');
            });
    });

    it('should accept valid tokens', function() {
        let badToken = tokenGenerator.getValidToken(battleNetId, region, platform);
        return chai.request(server)
            .post('/auth/token/validate')
            .send({token: badToken})
            .then((res) => {
                assert.equal(res.status, 200);
            });
    });
});