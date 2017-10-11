const assert = require('chai').assert;
const playerClient = require('../../../src/apiClients/PlayerClient');

const battleNetId = 'luckybomb#1470';
const region = 'us';
const platform = 'pc';

describe('PlayerClient', function() {
    this.timeout(10000);

    describe('getPlayerRank', function() {
        it('should return a valid object for a valid input', function() {
            return playerClient.getPlayerRank(battleNetId, region, platform).then((result) => {
                assert.isNotNull(result.rank);
                assert.equal(result.region, region);
                assert.equal(result.platform, platform);
            });
        });
    });
});