const assert = require('chai').assert;
const playerClient = require('../../../src/apiClients/PlayerClient');
const logger = require('winston');
const exec = require('child_process').exec;

const battleNetId = 'luckybomb#1470';
const region = 'us';
const platform = 'pc';

describe('PlayerClient', function() {
    this.timeout(10000);

    let startHeroApiServer = function() {
        let cwd = __dirname + '/../../../../heroApiServer';

        return exec('node src/app.js', {cwd, env: Object.assign({}, process.env, {NODE_ENV: 'develop'})},
            (err, stdout, stderr) => {
                logger.info(stdout);
                logger.error(stderr);
                logger.error(err);
            });
    };

    describe('getPlayerRank', function() {
        let heroApiServer;

        before(function(done) {
            heroApiServer = startHeroApiServer();
            setTimeout(done, 3000);
        });

        after(function(done) {
            heroApiServer.kill('SIGINT');
            setTimeout(done, 3000);
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