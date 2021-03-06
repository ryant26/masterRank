const assert = require('chai').assert;
const playerService = require('../../../src/services/playerService');
const authenticationService = require('../../../src/services/authenticationService');
const randomString = require('randomstring');
const sinon = require('sinon');

describe('authenticationService', function() {
    let next;

    beforeEach(function() {
        next = sinon.stub();
    });

    describe('verifyPlatformDisplayName', () => {
        const testRedirected = function(platformDisplayName) {
            const redirect = sinon.stub();
            const next = sinon.stub();
            assert.isFalse(redirect.calledOnce);
            authenticationService.verifyPlatformDisplayName({user: {platformDisplayName}}, {redirect}, next);
            sinon.assert.notCalled(next);
            sinon.assert.calledOnce(redirect);

            sinon.assert.calledWith(redirect, `/?failedLogin=true&platformDisplayName=${platformDisplayName ? platformDisplayName : ''}`);

        };

        it('should call the next handler upon valid platformDisplayName', function(done) {
            authenticationService.verifyPlatformDisplayName({user: {platformDisplayName: 'test#1234'}}, sinon.stub(), done);
        });

        it('should call redirect if platformDisplayName is null', function() {
            testRedirected(null);
        });

        it('should call redirect if platformDisplayName is undefined', function() {
            testRedirected(undefined);
        });

        it('should call redirect if platformDisplayName is an empty string', function() {
            testRedirected('');
        });
    });

    describe('serializeUser', function() {
        let sandbox;

        before(function() {
            sandbox = sinon.sandbox.create();
            sandbox.stub(playerService, 'findOrCreatePlayer').resolves(true);
        });

        after(function() {
            sandbox.restore();
        });

        it('should find or create the player in the db', function() {
            return authenticationService.serializeUser({}, {}, next).then(() => {
                assert.isTrue(playerService.findOrCreatePlayer.calledOnce);
                assert.isTrue(next.calledOnce);
            });
        });
    });

    describe('generateToken', function() {
        it('should generate a valid token and add it to the request obj', function() {
            let req = {
                user: {
                    platformDisplayName: randomString.generate(),
                    region: 'us',
                    platform: 'pc'
                }
            };

            authenticationService.generateToken(req, {}, next);
            assert.isNotNull(req.token);
            assert.isTrue(next.calledOnce);
        });
    });

    describe('respond', function() {
        let res = {
            cookie: sinon.stub(),
            redirect: sinon.stub()
        };

        let req = {
            token: 'a token!!'
        };

        it('should set the response header "set-cookie" with the token', function() {
            authenticationService.respond(req, res);
            assert.isTrue(res.cookie.calledWith('access_token', req.token));
        });

        it('should redirect the user to the homepage', function() {
            authenticationService.respond(req, res);
            assert.isTrue(res.redirect.calledWith('/'));
        });
    });

    describe('authenticateWithToken', function() {
        let token = {
            platformDisplayName: randomString.generate(),
            region: 'us',
            platform: 'pc'
        };

        let req = {
            user: token
        };

        it('should validate the token and add the information to req.user', function() {
            authenticationService.generateToken(req, {}, sinon.stub());

            delete(req.user);

            req.headers = {
                authorization: `bearer ${req.token}`
            };

            let next = function(err, user) {
                assert.isNull(err);
                assert.deepEqual(user, token);
            };

            authenticationService.authenticateWithToken(req, {}, next);
        });
    });
});