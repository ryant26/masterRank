const assert = require('chai').assert;
const playerClient = require('../../../src/apiClients/PlayerClient');
const logger = require('winston');
const spawn = require('child_process').spawn;

const battleNetId = 'luckybomb#1470';
const region = 'us';
const platform = 'pc';

describe('PlayerClient', function() {
    this.timeout(10000);

    let startHeroApiServer = function() {
        let cwd = __dirname + '/../../../../heroApiServer';

        let apiServer = spawn('node', ['src/app.js'], {cwd, env: Object.assign({}, process.env, {NODE_ENV: 'functionaltest'})});

        apiServer.stdout.on('data', (data) => {
            logger.info(`${data}`);
        });


        apiServer.stderr.on('data', (data) => {
            logger.error(`${data}`);
        });

        return apiServer;
    };

    describe('getPlayerRank', function() {
        let heroApiServer;

        before(function(done) {
            heroApiServer = startHeroApiServer();
            setTimeout(done, 3000);
        });

        after(function(done) {
            heroApiServer.on('close', () => {
                logger.info('gracefully exited');
                done();
            });

            heroApiServer.on('error', (err) => {
                logger.error(err);
                done(err);
            });

            heroApiServer.kill('SIGKILL');
        });

        it('should return a valid object for a valid input', function() {
            return playerClient.getPlayerRank(battleNetId, region, platform).then((result) => {
                assert.isNotNull(result.rank);
                assert.equal(result.region, region);
                assert.equal(result.platform, platform);
            });
        });
    });
});