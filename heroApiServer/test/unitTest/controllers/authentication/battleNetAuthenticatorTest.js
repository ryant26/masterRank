const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const mockHelpers = require('../../commonUtils/mockingHelpers');
const mockData = require('../../commonUtils/mockOverwatchData');

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

let makeAuthenticationRequest = function() {
    return chai.request(server)
        .get('/auth/bnet/callback')
        .query({region: mockHelpers.token.region})
        .redirects(0)
        .then(Promise.reject)
        .catch((err) => {
            let response = err.response;
            assert.equal(err.response.status, 302);
            assert.isTrue(err.response.headers.location.startsWith('/?access_token='));
            return response;
        });
};

describe('battleNetAuthenticator', function() {

    before(function() {
        mockHelpers.stubBnetAuth();
        mockHelpers.stubOverwatchAPI();
        Player.remove({});
    });

    afterEach(function() {
        Player.remove({});
    });

    after(function () {
        mockHelpers.restoreAllStubs();
    });

    it('should create the user on new login', function() {
        return Player.findOne(getPlayerQueryObj()).then((result) => {
            assert.isNull(result);
            return makeAuthenticationRequest();
        }).then(() => {
            return Player.findOne(getPlayerQueryObj());
        }).then((result) => {
            assert.equal(result.level, mockData.playerDetails.level);
        });
    });

    it('should update older users', function() {
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
            return makeAuthenticationRequest();
        }).then(() => {
            return Player.findOne(getPlayerQueryObj());
        }).then((result) => {
            assert.equal(result.level, mockData.playerDetails.level);
            assert.notEqual(playerConfig.level, mockData.playerDetails.level);
        });
    });
});