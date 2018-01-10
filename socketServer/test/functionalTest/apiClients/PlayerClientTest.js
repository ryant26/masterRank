const assert = require('chai').assert;
const playerClient = require('../../../src/apiClients/PlayerClient');
const logger = require('winston');
const spawn = require('child_process').spawn;
const config = require('config');

const platformDisplayName = 'luckybomb#1470';
const region = 'us';
const platform = 'pc';
const heroName = 'pharah';

const heroApiPort = config.get('heroApi.port');

describe('PlayerClient', function() {
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

    describe('getPlayerRank', function() {
        it('should return a valid object for a valid input', function() {
            return playerClient.getPlayerRank(platformDisplayName, region, platform).then((result) => {
                assert.isNotNull(result.rank);
                assert.equal(result.region, region);
                assert.equal(result.platform, platform);
            });
        });
    });

    describe('getHeroStats', function() {
        it('should return a valid object for a valid input', function() {
            return playerClient.getHeroStats(platformDisplayName, region, platform, heroName).then((result) => {
                assert.isNotNull(result.accuracy);
                assert.isNotNull(result.avgObjElims);
                assert.isNotNull(result.avgObjTime);
                assert.isNotNull(result.blockedPerMin);
                assert.isNotNull(result.damagePerMin);
                assert.isNotNull(result.healingPerMin);
                assert.equal(result.heroName, heroName);
                assert.isNotNull(result.hoursPlayed);
                assert.isNotNull(result.kdRatio);
                assert.isNotNull(result.lastModified);
                assert.isNotNull(result.losses);
            });
        });
    });
});