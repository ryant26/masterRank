const assert = require('chai').assert;
const playerClient = require('../../../src/apiClients/PlayerClient');
const playerService = require('../../../src/services/playerService');

describe('playerService', function() {
    describe('getPlayerRank', function() {
        const getSkillrating = playerClient.getSkillRating;

        after(function() {
            playerClient.getSkillRating = getSkillrating;
        });

        let setSkillReturn = function(sr) {
            playerClient.getSkillRating = () => Promise.resolve(sr);
        };

        let testRank = function(skillRating, rank) {
            setSkillReturn(skillRating);
            return playerService.getPlayerRank('plaformDisplayNamw', 'us', 'pc').then((result) => {
                assert.equal(result, rank);
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