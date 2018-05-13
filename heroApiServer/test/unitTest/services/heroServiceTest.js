const assert = require('chai').assert;
const db = require('../commonUtils/dbHelpers');
const Hero = require('../../../src/models/Hero');
const heroService = require('../../../src/services/heroService');
const mockData = require('../commonUtils/mockOverwatchData');
const mockHelpers = require('../commonUtils/mockingHelpers');

let queryForHero = function (token, heroName) {
    return Hero.findOne({
        heroName,
        platformDisplayName: token.platformDisplayName,
        platform: token.platform,
        region: token.region
    });
};

let getHeroConfig = function (token, heroName) {
    return {
        platformDisplayName: token.platformDisplayName,
        platform: token.platform,
        skillRating: 2500,
        lastModified: new Date(),
        region: token.region,
        heroName,
        hoursPlayed: 26,
        wins: 20,
        losses: 10,
        gamesPlayed: 30,
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

    describe('getHero', function () {

        it('should create players that are valid but do not exist', function () {
            return queryForHero(token, heroName).then((result) => {
                assert.isNull(result);
            }).then(() => {
                return heroService.getHero(token, heroName);
            }).then((hero) => {
                assert.equal(hero.platformDisplayName, token.platformDisplayName);
            }).then(() => {
                return queryForHero(token, heroName);
            }).then((player) => {
                assert.equal(player.platformDisplayName, token.platformDisplayName);
            });
        });

        it('should find players that already exist', function () {
            let createdHero;
            return new Hero(getHeroConfig(token, heroName)).save().then((hero) => {
                createdHero = hero;
                return heroService.getHero(token, heroName);
            }).then((hero) => {
                assert.equal(hero.heroName, createdHero.heroName);
                assert.equal(hero.platformDisplayName, createdHero.platformDisplayName);
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
                return heroService.getHero(token, heroName);
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
                return heroService.getHero(token, heroName);
            }).then((hero) => {
                assert.equal(hero.accuracy, mockData.playerStats.stats.competitive.soldier76.combat.weapon_accuracy);
                assert.notEqual(hero.accuracy, heroConfig.accuracy);
                assert.notEqual(hero.pAccuracy, heroConfig.pAccuracy);
            });
        });

        it('should not update players less than 6 hours old', function () {
            let heroConfig = getHeroConfig(token, heroName);
            return new Hero(heroConfig).save().then(() => {
                return heroService.getHero(token, heroName);
            }).then((hero) => {
                assert.equal(hero.accuracy, heroConfig.accuracy);
                assert.notEqual(hero.accuracy, mockData.playerStats.stats.competitive.soldier76.combat.weapon_accuracy);
            });
        });

        it('should update the last modified date of all heroes regardless of data change', function() {
            let date = new Date();
            date.setHours(date.getHours() - 2);

            let myHero = 'notActuallyAHero';
            let heroConfig = getHeroConfig(token, myHero);
            heroConfig.lastModified = date;

            return new Hero(heroConfig).save().then(() => {
                return heroService.getHero(token, heroName);
            }).then(() => {
                return queryForHero(token, myHero);
            }).then((hero) => {
                assert(hero.lastModified > date);
            });
        });

        it('should return the outdated hero if api unreachable', function() {
            mockHelpers.rejectOwGetPlayerStats();

            let date = new Date();
            date.setHours(date.getHours() - 7);

            let heroConfig = getHeroConfig(token, heroName);
            heroConfig.lastModified = date;

            return new Hero(heroConfig).save().then(() => {
                return heroService.getHero(token, heroName);
            }).then((hero) => {
                assert.equal(hero.accuracy, heroConfig.accuracy);
                assert.notEqual(hero.accuracy, mockData.playerStats.stats.competitive.soldier76.combat.weapon_accuracy);
            });
        });

        it('should return null if the platformDisplayName does not exist', function() {
            mockHelpers.rejectOwGetPlayerStats();
            return heroService.getHero({platformDisplayName: 'doesntexist#1234', region: 'us', platform: 'pc'}, 'someHero').then((result) => {
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
                return heroService.getHero({
                    platformDisplayName: mockPlayer.name,
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
            return heroService.getHero(token, heroName).then((hero) => {
                assert.isNull(hero);
            });
        });

        it('should handle missing losses stat', function () {
            let partialData = JSON.parse(JSON.stringify(mockData.playerStats));

            partialData.stats.competitive.soldier76.game.games_won = 10;
            partialData.stats.competitive.soldier76.game.games_played = 15;
            partialData.stats.competitive.soldier76.game.games_lost = undefined;

            mockHelpers.stubOverwatchAPI(partialData);

            return heroService.getHero(token, heroName).then((hero) => {
                assert.equal(hero.losses, 5);
            });
        });

        it('should handle missing losses stat and incorrect games played stat', function () {
            let partialData = JSON.parse(JSON.stringify(mockData.playerStats));

            partialData.stats.competitive.soldier76.game.games_won = 10;
            partialData.stats.competitive.soldier76.game.games_played = 9;
            partialData.stats.competitive.soldier76.game.games_lost = undefined;

            mockHelpers.stubOverwatchAPI(partialData);

            return heroService.getHero(token, heroName).then((hero) => {
                assert.equal(hero.losses, 0);
            });
        });

        it('should return the correct perMinute stats when the playtime is in minutes', function() {
            mockHelpers.stubOverwatchAPI(mockData.tenMinuteStats);
            const soldierStats = mockData.tenMinuteStats.stats.competitive.soldier76;
            const accuracy = soldierStats.combat.weapon_accuracy;
            const healing = soldierStats.assists.healing_done / soldierStats.game.time_played;
            const damage = soldierStats.combat.all_damage_done / soldierStats.game.time_played;
            const avgObjElims = soldierStats.combat.objective_kills / soldierStats.game.games_played;

            const min = 16;
            const sec = 18;
            const avgObjTime = ((min * 60) + sec)/ soldierStats.game.games_played;

            return heroService.getHero(token, heroName).then((hero) => {
                assert.equal(hero.accuracy, accuracy);
                assert.equal(hero.healingPerMin, healing);
                assert.equal(hero.damagePerMin, damage);
                assert.equal(hero.avgObjElims, avgObjElims);
                assert.equal(hero.avgObjTime, avgObjTime);
            });
        });

        it('should return the correct perMinute stats when the playtime is in hours', function() {
            let oneHourStats = JSON.parse(JSON.stringify(mockData.tenMinuteStats));
            oneHourStats.stats.competitive.soldier76.game.time_played = 1;
            mockHelpers.stubOverwatchAPI(oneHourStats);

            const soldierStats = mockData.tenMinuteStats.stats.competitive.soldier76;
            const accuracy = soldierStats.combat.weapon_accuracy;
            const healing = soldierStats.assists.healing_done / 60;
            const damage = soldierStats.combat.all_damage_done / 60;
            const avgObjElims = soldierStats.combat.objective_kills / soldierStats.game.games_played;

            const min = 16;
            const sec = 18;
            const avgObjTime = ((min * 60) + sec)/ soldierStats.game.games_played;

            return heroService.getHero(token, heroName).then((hero) => {
                assert.equal(hero.accuracy, accuracy);
                assert.equal(hero.healingPerMin, healing);
                assert.equal(hero.damagePerMin, damage);
                assert.equal(hero.avgObjElims, avgObjElims);
                assert.equal(hero.avgObjTime, avgObjTime);
            });
        });

        it('should self healing when general healing is not available', function() {
            let tenMinuteStats = JSON.parse(JSON.stringify(mockData.tenMinuteStats));
            tenMinuteStats.stats.competitive.soldier76.assists.healing_done = undefined;
            tenMinuteStats.stats.competitive.soldier76.hero.self_healing = 100;
            mockHelpers.stubOverwatchAPI(tenMinuteStats);

            const healing = 10;

            return heroService.getHero(token, heroName).then((hero) => {
                assert.equal(hero.healingPerMin, healing);
            });
        });
    });

    describe('getTopHeroes', function() {
        it('should return an empty array when no heroes have stats', function() {
            mockHelpers.stubOverwatchAPI(mockData.emptyPlayerStats);
            return heroService.getTopHeroes(token, 5).then((result) => {
                assert.isArray(result);
                assert.equal(result.length, 0);
            });
        });

        it('should return the top heroes based on games played', function() {
            mockHelpers.stubOverwatchAPI(mockData.playerStatsMultipleHeroes);
            return heroService.getTopHeroes(token, 3).then((result) => {
                assert.equal(result.length, 3);
                assert.deepEqual(result[0].heroName, 'soldier76');
            });
        });

        it('should return the as many heroes as possible when the number is greater than the ammount we have data for', function() {
            return heroService.getTopHeroes(token, 3).then((result) => {
                assert.equal(result.length, 1);
                assert.equal(result[0].heroName, 'soldier76');
            });

        });
    });

    describe('removeHeroes', function() {
        it('should return null if a players heros does not exist', function() {
            return heroService.removeHeroes(token).then((result) => {
                assert.isNull(result);
            });
        });

        it('should return ok if players heroes were removed', function() {
            return new Hero(getHeroConfig(token, heroName)).save()
                .then(() => {
                    return queryForHero(token, heroName);
                }).then((result) => {
                    assert.isNotNull(result);
                    return heroService.removeHeroes(token).then((res) => {
                        assert.equal(res.ok, 1);
                    }).then(() => {
                        return queryForHero(token, heroName).then((result) => {
                            assert.isNull(result, 'Hero was removed');
                        });
                    });
                });
        });
    });
});