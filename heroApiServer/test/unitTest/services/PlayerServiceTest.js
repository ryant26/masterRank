const assert = require('chai').assert;
const db = require('../commonUtils/dbHelpers');
const Player = require('../../../src/models/Player');
const playerService = require('../../../src/services/playerService');
const mockData = require('../commonUtils/mockOverwatchData');
const mockHelpers = require('../commonUtils/mockingHelpers');
const randomString = require('randomstring');
const sinon = require('sinon');
const ow = require('../../../src/apiClients/overwatch');

let queryForPlayer = function(token) {
    return Player.findOne({
        platformDisplayName: token.battleNetId,
        platform: token.platform,
        region: token.region
    });
};

let getPlayerConfig = function() {
    return {
        platformDisplayName: randomString.generate(),
        platform: 'xbl',
        lastUpdated: new Date(),
        level: 100,
        portrait: 'Some portrait link',
        region: 'us',
        skillRating: 2500
    };
};

let getTokenFromConfig = function(playerConfig) {
    return {
        battleNetId: playerConfig.platformDisplayName,
        region: playerConfig.region,
        platform: playerConfig.platform
    };
};

describe('playerService', function() {
    const token = {
        battleNetId: 'PwNShoPP-1662',
        region: 'us',
        platform: 'pc'
    };

    before(function() {
        db.connect();
    });

    beforeEach(function() {
        mockHelpers.stubOverwatchAPI();
        return Player.remove({});
    });

    afterEach(function() {
        mockHelpers.restoreAllStubs();
    });

    after(function() {
        return Player.remove({});
    });

    describe('findOrCreatePlayer', function() {

        it('should create players that are valid but do not exist', function() {
            return playerService.findOrCreatePlayer(token).then((player) => {
                assert.equal(player.platformDisplayName, token.battleNetId);
            }).then(() => {
                return queryForPlayer(token);
            }).then((player) => {
                assert.equal(player.platformDisplayName, token.battleNetId);
            });
        });

        it('should find players that already existt', function() {
            let createdPlayer;
            return playerService.findOrCreatePlayer(token).then((player) => {
                createdPlayer = player;
                return playerService.findOrCreatePlayer(token);
            }).then((player) => {
                assert(player._id.equals(createdPlayer._id));
            });
        });

        it('should return null if the player cannot be found', function () {
            mockHelpers.rejectOwGetPlayerDetails();
            return playerService.findAndUpdatePlayer(token).then((player) => {
                assert.isNull(player);
            });
        });

        it('should handle malformed hero stats API response', function() {
            mockHelpers.stubOwGetPlayerStats(mockData.playerNoStatsObj);
            return playerService.findOrCreatePlayer(token).then((player) => {
                assert.isNull(player);
            });
        });

        it('should handle malformed player details API response', function() {
            mockHelpers.stubOwGetPlayerDetails(mockData.playerDetailsNoLevel);
            return playerService.findOrCreatePlayer(token).then((player) => {
                assert.equal(player.level, 0);
            });
        });
    });

    describe('findAndUpdatePlayer', function() {
        it('should return null for non-existant players', function() {
            return playerService.findAndUpdatePlayer(token).then((player) => {
                assert.isNull(player);
            });
        });

        it('should return the player if they exist', function() {
            return playerService.findOrCreatePlayer(token).then(() => {
                return playerService.findAndUpdatePlayer(token);
            }).then((player) => {
                assert.equal(player.platformDisplayName, token.battleNetId);
            });
        });

        it('should update a player if it is more than 6 hours old', function () {
            let date = new Date();
            date.setHours(date.getHours() - 7);

            let playerConfig = getPlayerConfig();
            playerConfig.lastUpdated = date;

            let token2 = getTokenFromConfig(playerConfig);

            return new Player(playerConfig).save().then(() => {
                return playerService.findAndUpdatePlayer(token2);
            }).then((player) => {
                assert.equal(player.level, mockData.playerDetails.level);
                assert.notEqual(player.level, playerConfig.level);
                assert.equal(player.portrait, mockData.playerDetails.portrait);
            });
        });

        it('should not update players less than 6 hours old', function() {
            let playerConfig = getPlayerConfig();
            let token2 = getTokenFromConfig(playerConfig);

            return new Player(playerConfig).save().then(() => {
                return playerService.findAndUpdatePlayer(token2);
            }).then((player) => {
                assert.equal(player.level, playerConfig.level);
                assert.notEqual(player.level, mockData.level);
                assert.equal(player.portrait, playerConfig.portrait);
            });
        });

        it('should return the outdated player if the api cannot be reached', function() {
            mockHelpers.rejectOwGetPlayerDetails();

            let date = new Date();
            date.setHours(date.getHours() - 7);

            let playerConfig = getPlayerConfig();
            playerConfig.lastUpdated = date;

            let token2 = getTokenFromConfig(playerConfig);

            return new Player(playerConfig).save().then(() => {
                return playerService.findAndUpdatePlayer(token2);
            }).then((player) => {
                assert.equal(player.level, playerConfig.level);
                assert.notEqual(player.level, mockData.level);
                assert.equal(player.portrait, playerConfig.portrait);
            });
        });

        it('should handle malformed career details return from OW API', function() {
            mockHelpers.stubOwGetPlayerStats(mockData.playerNoStatsObj);
            let date = new Date();
            date.setHours(date.getHours() - 7);

            let playerConfig = getPlayerConfig();
            playerConfig.lastUpdated = date;

            let token2 = getTokenFromConfig(playerConfig);

            return new Player(playerConfig).save().then(() => {
                return playerService.findAndUpdatePlayer(token2);
            }).then((player) => {
                assert.equal(player.level, playerConfig.level);
                assert.notEqual(player.level, mockData.playerDetails.level);
                assert.equal(player.portrait, playerConfig.portrait);
            });
        });

        it('should handle malformed player details return from OW API', function() {
            mockHelpers.stubOwGetPlayerDetails(mockData.playerDetailsNoLevel);
            let date = new Date();
            date.setHours(date.getHours() - 7);

            let playerConfig = getPlayerConfig();
            playerConfig.lastUpdated = date;

            let token2 = getTokenFromConfig(playerConfig);

            return new Player(playerConfig).save().then(() => {
                return playerService.findAndUpdatePlayer(token2);
            }).then((player) => {
                assert.equal(player.level, 0);
            });
        });
    });

    describe('searchForPlayer', function() {
        it('should find a player', function() {
            let playerConfig = getPlayerConfig();
            return new Player(playerConfig).save().then(() => {
                return playerService.searchForPlayer({battleNetId: playerConfig.platformDisplayName});
            }).then((players) => {
                assert.lengthOf(players, 1);
                assert.equal(players[0].platformDisplayName, playerConfig.platformDisplayName);
                assert.equal(players[0].region, playerConfig.region);
                assert.equal(players[0].platform, playerConfig.platform);
            });
        });

        it('should handle spaces in names', function() {
            let playerConfig = getPlayerConfig();
            playerConfig.platformDisplayName = 'a name with spaces';
            return new Player(playerConfig).save().then(() => {
                return playerService.searchForPlayer({battleNetId: playerConfig.platformDisplayName});
            }).then((players) => {
                assert.lengthOf(players, 1);
                assert.equal(players[0].platformDisplayName, playerConfig.platformDisplayName);
                assert.equal(players[0].region, playerConfig.region);
                assert.equal(players[0].platform, playerConfig.platform);
            });
        });

        it('should handle multiple matches', function() {
            let playerConfig1 = getPlayerConfig();
            playerConfig1.region = 'us';
            let playerConfig2 = Object.assign({}, playerConfig1);
            playerConfig2.region = 'apac';
            let playerConfig3 = Object.assign({}, playerConfig1);
            playerConfig3.region = 'eu';

            return Promise.all([new Player(playerConfig1).save(), new Player(playerConfig2).save(), new Player(playerConfig3).save()]).then(() => {
                return playerService.searchForPlayer({battleNetId: playerConfig1.platformDisplayName});
            }).then((players) => {
                assert.lengthOf(players, 3);
            });
        });

        it('should match on region as well', function() {
            let playerConfig1 = getPlayerConfig();
            playerConfig1.region = 'us';
            let playerConfig2 = Object.assign({}, playerConfig1);
            playerConfig2.region = 'apac';
            let playerConfig3 = Object.assign({}, playerConfig1);
            playerConfig3.region = 'eu';

            return Promise.all([new Player(playerConfig1).save(), new Player(playerConfig2).save(), new Player(playerConfig3).save()]).then(() => {
                return playerService.searchForPlayer({battleNetId: playerConfig1.platformDisplayName, region: playerConfig1.region});
            }).then((players) => {
                assert.lengthOf(players, 1);
            });
        });

        it('should match on platform as well', function() {
            let playerConfig1 = getPlayerConfig();
            playerConfig1.platform = 'pc';
            let playerConfig2 = Object.assign({}, playerConfig1);
            playerConfig2.platform = 'xbl';
            let playerConfig3 = Object.assign({}, playerConfig1);
            playerConfig3.platform = 'psn';

            return Promise.all([new Player(playerConfig1).save(), new Player(playerConfig2).save(), new Player(playerConfig3).save()]).then(() => {
                return playerService.searchForPlayer({battleNetId: playerConfig1.platformDisplayName, platform: playerConfig1.platform});
            }).then((players) => {
                assert.lengthOf(players, 1);
            });
        });

        it('should return empty array when found nothing', function() {
            mockHelpers.stubOwSearchForPlayer([]);
            return playerService.searchForPlayer({battleNetId: 'someID'}).then((players) => {
                assert.lengthOf(players, 0);
            });
        });

        it('should reject when mongoose throws error', function() {
            let errorString = 'my Error!';
            sinon.stub(Player, 'find').rejects(errorString);
            playerService.searchForPlayer({battleNetId: 'someID'}).catch((err) => {
                assert.equal(err, errorString);
                Player.find.restore();
            });
        });

        it('shoud call the Overwatch API when not found in db', function() {
            mockHelpers.stubOwSearchForPlayer([]);
            return playerService.searchForPlayer({battleNetId: 'someID'}).then(() => {
                assert.isTrue(ow.searchForPlayer.calledOnce);
            });
        });

        it('should not call the Overwatch API when found in db', function() {
            mockHelpers.stubOwSearchForPlayer([]);
            return playerService.findOrCreatePlayer(token).then(() => {
                return playerService.searchForPlayer({battleNetId: token.battleNetId});
            }).then(() => {
                assert.isFalse(ow.searchForPlayer.called);
            });
        });
    });
});