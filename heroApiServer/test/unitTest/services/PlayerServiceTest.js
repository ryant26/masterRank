const assert = require('chai').assert;
const db = require('../commonUtils/dbHelpers');
const Player = require('../../../src/models/Player');
const playerService = require('../../../src/services/PlayerService');
const ow = require('../../../src/apiClients/overwatch');
const owMock = require('../commonUtils/mockOverwatchApi');
const sinon = require('sinon');

describe('Player Service Tests', function() {
    const token = {
        battleNetId: 'PwNShoPP-1662',
        region: 'us',
        platform: 'pc'
    };

    before(function() {
        db.connect();
        sinon.stub(ow, 'getPlayerStats').resolves(owMock.getPlayerStats);
        sinon.stub(ow, 'getPlayerDetails').resolves(owMock.getPlayerDetails);
    });

    beforeEach(function() {
        return Player.remove({});
    });

    after(function() {
        ow.getPlayerStats.restore();
        ow.getPlayerDetails.restore();
    });

    describe('findOrCreatePlayer', function() {

        it('should create players that are valid but do not exist', function() {
            return playerService.findOrCreatePlayer(token).then((player) => {
                assert.equal(player.platformDisplayName, token.battleNetId);
            }).then(() => {
                return Player.findOne({
                    platformDisplayName: token.battleNetId,
                    platform: token.platform,
                    region: token.region});
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
            let token2 = {
                battleNetId: 'test#1234',
                region: 'us',
                platform: 'pc'
            };

            let date = new Date();
            date.setHours(date.getHours() - 7);

            let playerConfig = {
                platformDisplayName: token2.battleNetId,
                platform: token2.platform,
                lastUpdated: date,
                level: 100,
                portrait: 'Some portrait link',
                region: token2.region,
                skillRating: 2500
            };

            return new Player(playerConfig).save().then(() => {
                return playerService.findAndUpdatePlayer(token2);
            }).then((player) => {
                assert.equal(player.level, owMock.getPlayerDetails.level);
                assert.notEqual(player.level, playerConfig.level);
                assert.equal(player.portrait, owMock.getPlayerDetails.portrait);
            });
        });

        it('should not update players less than 6 hours old', function() {
            let token2 = {
                battleNetId: 'test#1234',
                region: 'us',
                platform: 'pc'
            };

            let playerConfig = {
                platformDisplayName: token2.battleNetId,
                platform: token2.platform,
                lastUpdated: new Date(),
                level: 100,
                portrait: 'Some portrait link',
                region: token2.region,
                skillRating: 2500
            };

            return new Player(playerConfig).save().then(() => {
                return playerService.findAndUpdatePlayer(token2);
            }).then((player) => {
                assert.equal(player.level, playerConfig.level);
                assert.notEqual(player.level, owMock.level);
                assert.equal(player.portrait, playerConfig.portrait);
            });
        });
    });
});