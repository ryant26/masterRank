const assert = require('chai').assert;
const authenticationClient = require('../../../src/apiClients/authenticationClient');
const logger = require('winston');
const tokenHelper = require('../../../../heroApiServer/devTools/tokenHelpers');
const spawn = require('child_process').spawn;
const config = require('config');

const platformDisplayName = 'luckybomb#1470';
const region = 'us';
const platform = 'pc';

const heroApiPort = config.get('heroApi.port');

describe('AuthenticationClient', function() {
    this.timeout(10000);
    let heroApiServer;


    let startHeroApiServer = function() {
        return new Promise(function(resolve) {
            let cwd = __dirname + '/../../../../heroApiServer';

            let apiServer = spawn('node', ['src/app.js'], {cwd, env: Object.assign({}, process.env, {NODE_ENV: 'functionaltest'})});

            apiServer.stdout.on('data', (data) => {
                logger.info(`${data}`);
                let stringForm = data.toString();
                if (stringForm.endsWith(`port ${heroApiPort}\n`)) {
                    resolve(apiServer);
                }
            });

            apiServer.on('error', (err) => {
                logger.error(err);
                apiServer.kill('SIGKILL');
            });


            apiServer.stderr.on('data', (data) => {
                logger.error(`${data}`);
            });
        });

    };

    before(function() {
        return startHeroApiServer().then((result) => {
            heroApiServer = result;
        });
    });

    after(function(done) {
        heroApiServer.on('close', () => {
            logger.info('heroApiServer gracefully exited');
            done();
        });

        heroApiServer.kill('SIGKILL');
    });

    describe('authenticate', function() {
        it('should resolve the promise for a valid token', function() {
            return authenticationClient.authenticate(tokenHelper.getValidToken(platformDisplayName, region, platform))
                .then((decodedToken) => {
                    assert.equal(decodedToken.platformDisplayName, platformDisplayName);
                    assert.equal(decodedToken.region, region);
                    assert.equal(decodedToken.platform, platform);
                });
        });

        it('should reject the promise for an expired token', function() {
            return authenticationClient.authenticate(tokenHelper.getExpiredToken(platformDisplayName, region, platform))
                .then(() => {
                    throw new Error('Should have been unauthorized');
                })
                .catch((err) => {
                    assert.equal(err.statusCode, 401);
                });
        });

        it('should reject the promise for an invalid token', function() {
            return authenticationClient.authenticate(tokenHelper.getTokenSignedWithOldSecret(platformDisplayName, region, platform))
                .then(() => {
                    throw new Error('Should have been unauthorized');
                })
                .catch((err) => {
                    assert.equal(err.statusCode, 401);
                });
        });
    });
});