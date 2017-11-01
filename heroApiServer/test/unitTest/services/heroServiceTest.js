const assert = require('chai').assert;
const db = require('../commonUtils/dbHelpers');
const Hero = require('../../../src/models/Hero');
const heroService = require('../../../src/services/heroService');
const mockData = require('../commonUtils/mockOverwatchData');
const mockHelpers = require('../commonUtils/mockingHelpers');

let queryForHero = function (token, heroName) {
    return Hero.findOne({
        heroName,
        platformDisplayName: token.battleNetId,
        platform: token.platform,
        region: token.region
    });
};

let getHeroConfig = function (token, heroName) {
    return {
        platformDisplayName: token.battleNetId,
        platform: token.platform,
        lastModified: new Date(),
        region: token.region,
        heroName,
        hoursPlayed: 26,
        wins: 10,
        losses: 1,
        kdRatio: 2.33,
        pKdRatio: 0.8,
        accuracy: 21,
        pAccuracy: 0.55,
        blockedPerMin: 3000,
        pBlockedPerMin: 0.6,
        healingPerMin: 200,
        pHealingPerMin: 40,
        damagePerMin: 1000,
        pDamagePerMin: 0.95,
        avgObjElims: 3,
        pAvgObjElims: 0.22,
        avgObjTime: 10000,
        pAvgObjTime: 0.86
    };
};

describe('heroService', function () {
    let token = mockData.token;
    let heroName = 'soldier76';

    before(function () {
        db.connect();
    });

    beforeEach(function () {
        mockHelpers.stubOverwatchAPI(mockData.playerStats);
        return Hero.remove({});
    });

    after(function () {
        mockHelpers.restoreAllStubs();
        return Hero.remove({});
    });

    describe('findAndUpdateOrCreateHero', function () {

        it('should create players that are valid but do not exist', function () {
            return queryForHero(token, heroName).then((result) => {
                assert.isNull(result);
            }).then(() => {
                return heroService.findAndUpdateOrCreateHero(token, heroName);
            }).then((hero) => {
                assert.equal(hero.platformDisplayName, token.battleNetId);
            }).then(() => {
                return queryForHero(token, heroName);
            }).then((player) => {
                assert.equal(player.platformDisplayName, token.battleNetId);
            });
        });

        it('should find players that already exist', function () {
            let createdHero;
            return new Hero(getHeroConfig(token, heroName)).save().then((hero) => {
                createdHero = hero;
                return heroService.findAndUpdateOrCreateHero(token, heroName);
            }).then((hero) => {
                assert(hero._id.equals(createdHero._id));
            });
        });

        it('should not update hero stats that have retrieved with zero, NaN or null', function () {
            let date = new Date();
            date.setHours(date.getHours() - 7);

            let heroConfig = getHeroConfig(token, heroName);
            heroConfig.lastModified = date;

            let partialData = JSON.parse(JSON.stringify(mockData.playerStats));

            partialData.stats.competitive.soldier76.combat.weapon_accuracy = 0;

            mockHelpers.stubOverwatchAPI(partialData);

            return new Hero(heroConfig).save().then(() => {
                return heroService.findAndUpdateOrCreateHero(token, heroName);
            }).then((hero) => {
                assert.equal(hero.accuracy, heroConfig.accuracy);
                assert.equal(hero.pAccuracy, heroConfig.pAccuracy);
                assert.notEqual(hero.accuracy, 0);
            });
        });

        it('should update hero if it is more than 6 hours old', function () {
            let date = new Date();
            date.setHours(date.getHours() - 7);

            let heroConfig = getHeroConfig(token, heroName);
            heroConfig.lastModified = date;

            return new Hero(heroConfig).save().then(() => {
                return heroService.findAndUpdateOrCreateHero(token, heroName);
            }).then((hero) => {
                assert.equal(hero.accuracy, mockData.playerStats.stats.competitive.soldier76.combat.weapon_accuracy);
                assert.notEqual(hero.accuracy, heroConfig.accuracy);
                assert.notEqual(hero.pAccuracy, heroConfig.pAccuracy);
            });
        });

        it('should not update players less than 6 hours old', function () {
            let heroConfig = getHeroConfig(token, heroName);
            return new Hero(heroConfig).save().then(() => {
                return heroService.findAndUpdateOrCreateHero(token, heroName);
            }).then((hero) => {
                assert.equal(hero.accuracy, heroConfig.accuracy);
                assert.notEqual(hero.accuracy, mockData.playerStats.stats.competitive.soldier76.combat.weapon_accuracy);
            });
        });

        it('should return the outdated hero if api unreachable', function() {
            mockHelpers.rejectOwGetPlayerStats();

            let date = new Date();
            date.setHours(date.getHours() - 7);

            let heroConfig = getHeroConfig(token, heroName);
            heroConfig.lastModified = date;

            return new Hero(heroConfig).save().then(() => {
                return heroService.findAndUpdateOrCreateHero(token, heroName);
            }).then((hero) => {
                assert.equal(hero.accuracy, heroConfig.accuracy);
                assert.notEqual(hero.accuracy, mockData.playerStats.stats.competitive.soldier76.combat.weapon_accuracy);
            });
        });

        it('should return null if the battleNetId does not exist', function() {
            mockHelpers.rejectOwGetPlayerStats();
            return heroService.findAndUpdateOrCreateHero({battleNetId: 'doesntexist#1234', region: 'us', platform: 'pc'}, 'someHero').then((result) => {
                assert.isNull(result);
            });
        });

        it('should calculate percentiles correclty', function () {
            mockHelpers.stubOwGetPlayerStats(mockData.mockPlayer);
            let mockPlayer = mockData.mockPlayer;
            let seedPlayers = mockHelpers.getSeedUsers(4, 'soldier76');

            return Promise.all(seedPlayers.map((config) => {
                return new Hero(config).save();
            })).then(() => {
                return heroService.findAndUpdateOrCreateHero({
                    battleNetId: mockPlayer.name,
                    region: mockPlayer.region,
                    platform: mockPlayer.platform
                }, 'soldier76');
            }).then((hero) => {
                assert.equal(hero.pKdRatio, 0.5);
                assert.equal(hero.pAccuracy, 0.5);
                assert.equal(hero.pBlockedPerMin, 0.5);
                assert.equal(hero.pHealingPerMin, 0.5);
                assert.equal(hero.pDamagePerMin, 0.5);
                assert.equal(hero.pAvgObjElims, 0.5);
                assert.equal(hero.pAvgObjTime, 0.5);

            });
        });

        it('should handle malformed reply from ow API', function () {
            mockHelpers.stubOwGetPlayerStats(mockData.mockPlayerMissingHeroAttributes);
            return heroService.findAndUpdateOrCreateHero(token, heroName).then((hero) => {
                assert.isNull(hero);
            });
        });
    });
});