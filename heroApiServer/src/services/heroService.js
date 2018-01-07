const mongoose = require('mongoose');
const Hero = mongoose.model('Hero');
const ow = require('../apiClients/overwatch');
const owValidators = require('../validators/owApiValidator');
const logger = require('./logger').sysLogger;
const config = require('config');

const reloadThreshold = config.get('reloadThreshold');
const gamesPlayedThreshold = config.get('minimumGamesPlayed');


let findHeroNamesWithGamesPlayed = function(token, gamesPlayed) {
    let getHeroNames = function(array) {
        return array.map((hero) => {
            return hero.heroName;
        });
    };

    let queryForQualifiedHeroes = function() {
        return Hero.find(_getGamesPlayedQueryCriteria(token, gamesPlayed)).select('heroName lastModified');
    };

    return queryForQualifiedHeroes().then((result) => {
        if (!result.length) {
            return _updatePlayerHeroes(token).then(() => {
                return queryForQualifiedHeroes();
            }).then((heroes) => getHeroNames(heroes));
        }

        let outOfDate = false;
        result.forEach((hero) => {
            if (_isDateOlderThan(hero.lastModified, reloadThreshold)) {
                outOfDate = true;
            }
        });

        if (outOfDate) {
            return _updatePlayerHeroes(token).then(() => queryForQualifiedHeroes()).then((updatedHeroes) => {
                if (updatedHeroes.length) {
                    return getHeroNames(updatedHeroes);
                }
            });
        }

        return getHeroNames(result);
    });
};

let findAndUpdateOrCreateHero = function(token, heroName) {
    let queryForHero = function() {
        return Hero.findOne(_getHeroNameQueryCriteria(token, heroName));
    };

    return queryForHero().then((result) => {
        if (!result) {
            return _updatePlayerHeroes(token).then(() => queryForHero());
        }

        if (_isDateOlderThan(result.lastModified, reloadThreshold)) {
            return _updatePlayerHeroes(token).then(() => queryForHero()).then((hero) => {
                if (hero) {
                    return hero;
                }
            });
        }

        return result;
    });
};


let _updatePlayerHeroes = function(token) {
    let getAllUserHeroes = function() {
        return Hero.find(_getAllUserHeroesQueryCriteria(token));
    };

    let sanitizeNewData = function(newHero, oldHero) {
        Object.keys(newHero).forEach((key) => {
            if (!newHero[key] && oldHero[key]) {
                newHero[key] = oldHero[key];
            }
        });
    };

    return Promise.all([_getUpdatedHeroConfigObjects(token), getAllUserHeroes()]).then((promiseReturns) => {
        let updatedInfo = promiseReturns[0].filter((hero) => hero !== null);
        let oldData = promiseReturns[1];

        let bulkOperations = updatedInfo.map((updatedHeroConfig) => {
            if (oldData) {
                let oldHeroConfig = oldData.find((hero) => hero.heroName === updatedHeroConfig.heroName);
                if (oldHeroConfig) {
                    sanitizeNewData(updatedHeroConfig, oldHeroConfig);
                }
            }

            return {
                updateOne: {
                    filter: _getHeroNameQueryCriteria(token, updatedHeroConfig.heroName),
                    update: updatedHeroConfig,
                    upsert: true
                }
            };
        });

        return Hero.collection.bulkWrite(bulkOperations, {new: true});
    }).catch((error) => {
        logger.error(`Error updating heroes for ${token.battleNetId}: ${error}`);
        return [];
    });
};

let _getHeroNameQueryCriteria = function(token, heroName) {
    return Object.assign({}, _getAllUserHeroesQueryCriteria(token), {heroName});
};

let _getGamesPlayedQueryCriteria = function(token, gamesPlayed) {
    return Object.assign({}, _getAllUserHeroesQueryCriteria(token), {gamesPlayed: {$gte: gamesPlayed}});
};

let _getAllUserHeroesQueryCriteria = function(token) {
    return {
        platformDisplayName: token.battleNetId,
        region: token.region,
        platform: token.platform,
    };
};

let _getUpdatedHeroConfigObjects = function(token) {
    return _getCompetitveStatsFromOw(token).then(({heroes, skillRating}) => {
        return Promise.all(Object.keys(heroes).map((heroName) => {
            let nonNormalizingStats;
            let statsToBeNormalized;

            let heroStats = heroes[heroName];
            heroStats.skillRating = skillRating;

            owValidators.heroValidator(heroStats);
            nonNormalizingStats = _getStatsNotRequiringPercentiles(token, heroName, heroStats);
            if (nonNormalizingStats.gamesPlayed >= gamesPlayedThreshold) {
                statsToBeNormalized = _getStatsRequiringPercentiles(heroStats);
                return _getPercentiles(heroName, statsToBeNormalized).then((percentiles) => {
                    Object.assign(nonNormalizingStats, statsToBeNormalized, percentiles);
                    return nonNormalizingStats;
                });
            } else {
                return Promise.resolve(null);
            }
        }));
    });
};

let _getStatsNotRequiringPercentiles = function(token, heroName, heroStats) {
    return {
        platformDisplayName: token.battleNetId,
        platform: token.platform,
        region: token.region,
        skillRating: heroStats.skillRating ? heroStats.skillRating : 0,
        lastModified: new Date(),
        heroName,
        hoursPlayed: heroStats.game.time_played,
        wins: heroStats.game.games_won,
        losses: heroStats.game.games_lost,
        gamesPlayed: heroStats.game.games_played
    };
};

let _getStatsRequiringPercentiles = function(heroStats) {

    let getPerMinuteStat = function(stat) {
        let minutes = heroStats.game.time_played * 60;
        let value = stat ? stat : 0;
        return value / minutes;
    };

    let convertTimeStringToNumber = function(timeString) {
        let seconds  = 0;
        if (typeof timeString === 'string') {
            let tokens = timeString.split(':');
            for (let i = 0; i < tokens.length; i++) {
                seconds += parseInt(tokens[i] * Math.pow(60, tokens.length - 1 -i));
            }
            return seconds;
        }
    };

    return {
        kdRatio: heroStats.combat.eliminations / heroStats.combat.deaths,
        accuracy: heroStats.combat.weapon_accuracy,
        blockedPerMin: getPerMinuteStat(heroStats.hero.damage_blocked),
        healingPerMin: getPerMinuteStat(heroStats.assists.healing_done),
        damagePerMin: getPerMinuteStat(heroStats.combat.all_damage_done),
        avgObjElims: heroStats.combat.objective_kills / heroStats.game.games_played,
        avgObjTime: convertTimeStringToNumber(heroStats.combat.objective_time) / heroStats.game.games_played
    };
};

let _getPercentiles = function (heroName, stats) {
    return Hero.aggregate({$match: {heroName}}, {$sample: {size: 1000}}).then((result) => {
        let percentiles = {};
        Object.entries(stats).forEach((keyVal) => {
            let numberOfDocumentsLessThan = 0;
            let totalDocuments = result.length || 1;
            let key = keyVal[0];

            result.forEach((document) => {
                if (document[key] < stats[key]) {
                    numberOfDocumentsLessThan++;
                }
            });

            let camelCaseKey = _getPercentileKey(key);
            percentiles[camelCaseKey] = numberOfDocumentsLessThan / totalDocuments;
        });

        return percentiles;
    }).catch(err => {
        logger.error(err);
    });
};

let _isDateOlderThan = function(date, hours) {
    return new Date(date).setHours(date.getHours() + hours) < new Date();
};

let _getCompetitveStatsFromOw = function(token) {
    return _getPlayerStatsFromOw(token).then((stats) => {
        let compStats = {
            heroes: stats.competitive,
            skillRating: stats.competitiveRank
        };

        delete compStats.heroes.all;

        return compStats;
    });
};

let _getPlayerStatsFromOw = function(token) {
    return ow.getPlayerStats(token).then((stats) => {
        return stats.stats;
    });
};

let _getPercentileKey = function(key) {
    return 'p' + key.charAt(0).toUpperCase() + key.slice(1);
};


module.exports = {
    findAndUpdateOrCreateHero,
    findHeroNamesWithGamesPlayed
};