const assert = require('chai').assert;
const playerClient = require('../../../src/apiClients/PlayerClient');
const nock = require('nock');
const platformDisplayName = 'luckybomb#1470';
const region = 'us';
const platform = 'pc';
const config = require('config');
const mockingUtility = require('../../../src/mockingUtilities/mockDependencies');

const playerUrl = `${config.get('playerApi.baseUrl')}:${config.get('playerApi.port')}`;
const findPlayerPath = config.get('playerApi.endpoint');

describe('PlayerClient', function() {
    let setPlayerResponse = function(response) {
        nock(playerUrl)
            .get(findPlayerPath)
            .query({platformDisplayName: platformDisplayName, region, platform})
            .reply(200, response);
    };

    before(function() {
        nock.disableNetConnect();
        mockingUtility.restorePlayerApi();
    });

    after(function() {
        nock.cleanAll();
        nock.restore();
        mockingUtility.mockAllDependenciesForEnvironment();
    });

    describe('getPlayerSkillRating', function() {
        it('should return the value retrieved from blizzard', function() {
            const skillRating = 1789;
            setPlayerResponse({skillRating});
            return playerClient.getSkillRating(platformDisplayName, region, platform).then((sr) => {
                assert.equal(sr, skillRating);
            });
        });
    });
});