const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const tokenUtil = require('../../devTools/tokenHelpers');

const platformDisplayName = 'PwNShoPP#1662';
const region = 'us';
const platform = 'pc';

let server = require('../../src/app');
let playerUrl = '/api/players';
let searchUrl = `${playerUrl}/search`;
let removeUrl = `${playerUrl}/remove`;

chai.use(chaiHttp);

describe('Player Tests', function() {
    this.timeout(20000);

    describe('Players/Search', function () {
        it('should return valid object with valid platformDisplayName', function() {
            return chai.request(server)
                .get(searchUrl)
                .query({platformDisplayName: platformDisplayName})
                .then((res) => {
                    assert.lengthOf(res.body, 1);
                    assert.equal(res.body[0].platformDisplayName, platformDisplayName);
                });
        });

        it('should have status of 400 when query param is not supplied', function() {
            return chai.request(server)
                .get(searchUrl)
                .catch((err) => {
                    assert.equal(err.status, 400);
                    assert.equal(err.response.body.message, 'Missing or malformed query parameter');
                });
        });

        it('should filter by platform', function() {
            return chai.request(server)
                .get(searchUrl)
                .query({platformDisplayName: platformDisplayName, platform: 'pc'})
                .then((res) => {
                    assert.lengthOf(res.body, 1);
                    assert.equal(res.body[0].platformDisplayName, platformDisplayName);
                });
        });

        it('should filter by platform (exclude)', function() {
            return chai.request(server)
                .get(searchUrl)
                .query({platformDisplayName: platformDisplayName, platform: 'xbl'})
                .then((res) => {
                    assert.lengthOf(res.body, 0);
                });
        });
    });

    describe('Players', function () {
        it('should return valid object with valid platformDisplayName', function() {
            return chai.request(server)
                .get(playerUrl)
                .query({platformDisplayName, region, platform})
                .then((res) => {
                    assert.equal(res.body.platformDisplayName, platformDisplayName);
                });
        });

        it('should have status of 400 when query params are not supplied', function() {
            return chai.request(server)
                .get(searchUrl)
                .catch((err) => {
                    assert.equal(err.status, 400);
                    assert.equal(err.response.body.message, 'Missing or malformed query parameter');
                });
        });

        it('should filter by platform', function() {
            return chai.request(server)
                .get(playerUrl)
                .query({platformDisplayName, region,  platform: 'xbl'})
                .then(() => {
                    throw new Error('Hero should not have been found');
                }).catch((err) => {
                    assert.equal(err.status, 404);
                    assert.equal(err.response.body.message, 'Player could not be found');
                });
        });

        it('should find console players', function() {
            let platformDisplayName = 'Wiinter_455';
            return chai.request(server)
                .get(playerUrl)
                .query({platformDisplayName, region, platform: 'psn'})
                .then((res) => {
                    assert.equal(res.body.platformDisplayName, platformDisplayName);
                });
        });
    });

    describe('Players/remove', function() {

        it('should return 401 if no token is in header authorization req', function() {
            return chai.request(server)
                .get(removeUrl)
                .catch((err) => {
                    assert.equal(err.status, 401);
                    assert.equal(err.response.body.message, 'No authorization token was found');
                });
        });

        it('should return 401 when valid token passed but is expired', () => {
            let expiredToken = tokenUtil.getExpiredToken();
            let authHeader = `Bearer ${expiredToken}`;
            return chai.request(server)
                .get(removeUrl)
                .set('authorization', authHeader)
                .catch((err) => {
                    assert.equal(err.status, 401);
                    assert.equal(err.response.body.message, 'jwt expired');
                });
        });

        it('should return 401 when valid token passed but signed with wrong secret', () => {
            let wrongToken = tokenUtil.getTokenSignedWithOldSecret();
            let authHeader = `Bearer ${wrongToken}`;
            return chai.request(server)
                .get(removeUrl)
                .set('authorization', authHeader)
                .catch((err) => {
                    assert.equal(err.status, 401);
                    assert.equal(err.response.body.message, 'invalid signature');
                });
        });

        it('should return valid object with correct platformDisplayName player assigned to platformDisplayName', function() {
            let token = tokenUtil.getValidToken(platformDisplayName, region, platform);
            let authHeader = `Bearer ${token}`;
            return chai.request(server)
                .get(removeUrl)
                .set('authorization', authHeader)
                .then((res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.platformDisplayName, platformDisplayName);
                });
        });


    });
});