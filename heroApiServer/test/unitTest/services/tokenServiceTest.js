const assert = require('chai').assert;
const tokenService = require('../../../src/services/tokenService');
const tokenHelpers = require('../../../devTools/tokenHelpers');
const randomString = require('randomstring');

describe('tokenService', function() {
    let config;

    beforeEach(function() {
        config = {
            platformDisplayName: randomString.generate(),
            region: randomString.generate(),
            platform: randomString.generate()
        };
    });


    describe('getToken', function() {
        it('return a jwt token', function() {
            let token = tokenService.getToken(config.platformDisplayName, config.region, config.platform);
            assert.isString(token);
        });
    });

    describe('verifyToken', function() {
        let verifyInvalidToken = function(token, message) {
            let req = {
                headers: {
                    authorization: `bearer ${token}`
                }
            };

            let next = function(err) {
                assert.isNotNull(err);
                assert.equal(err.message, message);
            };

            tokenService.verifyToken(req, {}, next);
        };

        it('should validate token', function() {
            let token = tokenService.getToken(config.platformDisplayName, config.region, config.platform);

            let req = {
                headers: {
                    authorization: `bearer ${token}`
                }
            };

            let next = function(err, user) {
                assert.isNull(err);
                assert.deepEqual(user, token);
            };

            tokenService.verifyToken(req, {}, next);
        });

        it ('should invalidate expired tokens', function() {
            let token = tokenHelpers.getExpiredToken(config.platformDisplayName, config.region, config.platform);
            verifyInvalidToken(token, 'jwt expired');
        });

        it ('should invalidate tokens signed with the wrong secret', function() {
            let token = tokenHelpers.getTokenSignedWithOldSecret(config.platformDisplayName, config.region, config.platform);
            verifyInvalidToken(token, 'invalid signature');
        });
    });
});