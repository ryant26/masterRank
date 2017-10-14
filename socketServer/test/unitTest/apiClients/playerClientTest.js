const assert = require('chai').assert;
const playerClient = require('../../../src/apiClients/PlayerClient');
const nock = require('nock');
const battleNetId = 'luckybomb#1470';
const region = 'us';
const platform = 'pc';
const config = require('config');

const playerUrl = `${config.get('playerApi.baseUrl')}:${config.get('playerApi.port')}`;
const findPlayerPath = config.get('playerApi.endpoint');

describe('PlayerClient', function() {
    let setPlayerResponse = function(response) {
        nock(playerUrl)
            .get(findPlayerPath)
            .query({platformDisplayName: battleNetId, region, platform})
            .reply(200, response);
    };

    before(function() {
        nock.disableNetConnect();
    });

    describe('getPlayerRank', function() {
        describe('rank', function() {
            let testRank = function(skillRating, rank) {
                setPlayerResponse({skillRating});
                return playerClient.getPlayerRank(battleNetId, region, platform).then((result) => {
                    assert.equal(result.rank, rank);
                });
            };

            it('Should return bronze', function() {
                return testRank(1300, 'bronze');
            });

            it('Should return silver', function() {
                return testRank(1600, 'silver');
            });

            it('Should return gold', function() {
                return testRank(2100, 'gold');
            });

            it('Should return platinum', function() {
                return testRank(2600, 'platinum');
            });

            it('Should return diamond', function() {
                return testRank(3100, 'diamond');
            });

            it('Should return master', function() {
                return testRank(3600, 'master');
            });

            it('Should return grandmaster', function() {
                return testRank(4100, 'grandmaster');
            });

        });
    });
});