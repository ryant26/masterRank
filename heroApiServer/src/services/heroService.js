const mongoose = require('mongoose');
const Hero = mongoose.model('Hero');
const ow = require('../apiClients/overwatch');
const owValidators = require('../validators/owApiValidator');
const logger = require('winston');
const config = require('config');

const reloadThreshold = config.get('reloadThreshold');

let findAndUpdateOrCreateHero = function(token, heroName) {
    return Hero.findOne(_getQueryCriteria(token, heroName)).then((result) => {
        if (!result) {
            return _createHero(token, heroName);
        }

        if (_isDateOlderThan(result.lastModified, reloadThreshold)) {
            return _updateHero(token, heroName).catch((err) => {
                logger.error(`Found hero [${token.battleNetId}:${heroName}], but could not update: ${err.message}`);
                return result;
            });
        }

        return result;
    });
};


let _updateHero = function(token, heroName) {
    return _getUpdatedHeroConfigObject(token, heroName).then((updatedInfo) => {
        return Hero.findOneAndUpdate(_getQueryCriteria(token, heroName), updatedInfo, {new: true});
    });
};

let _getQueryCriteria = function(token, heroName) {
    return {
        platformDisplayName: token.battleNetId,
        region: token.region,
        platform: token.platform,
        heroName
    };
};


let _createHero = function (token, heroName) {
    return _getUpdatedHeroConfigObject(token, heroName).catch((err) => {
        if (err.statusCode && err.statusCode === 404) {
            logger.error(`Error creating hero [${token.battleNetId}:${heroName}]: could not be found`);
            return null;
        }
    }).then((heroConfig) => {
        if (heroConfig) {
            return new Hero(heroConfig).save();
        }

        return null;
    }).catch((err) => {
        logger.error(`Error saving new hero object: ${err.message}`);
        return null;
    });
};

let _getUpdatedHeroConfigObject = function(token, heroName) {
    let nonNormalizingStats;
    let statsToBeNormalized;


    return _getCompetitveStatsFromOw(token).then((result) => {
        let heroStats = result[heroName];
        owValidators.heroValidator(heroStats);
        nonNormalizingStats = _getStatsNotRequiringPercentiles(token, heroName, heroStats);
        statsToBeNormalized = _getStatsRequiringPercentiles(heroStats);

        return _getPercentiles(heroName, statsToBeNormalized);
    }).then((percentiles) => {
        Object.assign(nonNormalizingStats, statsToBeNormalized, percentiles);
        return nonNormalizingStats;
    });
};

let _getStatsNotRequiringPercentiles = function(token, heroName, heroStats) {
    return {
        platformDisplayName: token.battleNetId,
        platform: token.platform,
        region: token.region,
        lastModified: new Date(),
        heroName,
        hoursPlayed: heroStats.game.time_played,
        wins: heroStats.game.games_won,
        losses: heroStats.misc.games_lost
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
        kdRatio: heroStats.combat.eliminations_per_life,
        accuracy: heroStats.combat.weapon_accuracy,
        blockedPerMin: getPerMinuteStat(heroStats.hero.damage_blocked),
        healingPerMin: getPerMinuteStat(heroStats.assists.healing_done),
        damagePerMin: getPerMinuteStat(heroStats.combat.all_damage_done),
        avgObjElims: heroStats.combat.objective_kills / heroStats.game.games_played,
        avgObjTime: convertTimeStringToNumber(heroStats.game.objective_time) / heroStats.game.games_played
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

            let camelCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
            percentiles[`p${camelCaseKey}`] = numberOfDocumentsLessThan / totalDocuments;
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
        return stats.competitive;
    });
};

let _getPlayerStatsFromOw = function(token) {
    return ow.getPlayerStats(token).then((stats) => {
        return stats.stats;
    });
};

module.exports = {
    findAndUpdateOrCreateHero
};