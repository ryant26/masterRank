const mongoose = require('mongoose');
const Player = mongoose.model('Player');
const logger = require('./logger').sysLogger;
const ow = require('../apiClients/overwatch');
const owValidator = require('../validators/owApiValidator');
const memoize = require('memoizee');
const config = require('config');
const cachingEnabled = config.get('cachingEnabled');

let findAndDeletePlayer = function(token) {
    return Player.findOne({
        platformDisplayName: token.platformDisplayName, 
        platform: token.platform
    }).then((result) => {
        if (result) {
            return Player.findByIdAndRemove(result._id).catch((err) => {
                logger.error(`Error finding/deleting player [${token.platformDisplayName}]: ${err}`);
                return null;
            });
        } 
        return null; 
    }).catch((err) => {
        logger.error(`Error finding/deleting player [${token.platformDisplayName}]: ${err}`);
        return null;
    });
};

let searchForPlayer = function(token) {
    let queryCriteria = {
        platformDisplayName: token.platformDisplayName
    };

    if (token.platform) {
        queryCriteria.platform = token.platform;
    }

    if (token.region) {
        queryCriteria.region = token.region;
    }

    return Player.find(queryCriteria).then((players) => {
        if (players && players.length === 0) {
            return ow.searchForPlayer(token);
        }

        return players;
    }).catch((err) => {
        logger.error(`Error searching for player ${token.platformDisplayName}: ${err}`);
        throw err;
    });
};

let findOrCreatePlayer = function(token) {
    return findAndUpdatePlayer(token).then((player) => {
        if (!player) {
            return createPlayer(token).catch((err) => {
                let error = err.statusCode || err;
                logger.error(`Error creating player [${token.platformDisplayName}]: ${error}`);
                return null;
            });
        }

        return player;
    }).catch((err) => {
        logger.error(`Error finding/updating player [${token.platformDisplayName}]: ${err}`);
        return null;
    });
};

let findAndUpdatePlayer = function(token) {
    return Player.findOne({platformDisplayName: token.platformDisplayName, platform: token.platform}).then((result) => {
        if (result) {
            if (new Date(result.lastUpdated).setHours(result.lastUpdated.getHours() + 6) < new Date()) {
                return updatePlayer(token).catch((err) => {
                    logger.error(`Found player ${token.platformDisplayName} but failed to update: ${err}`);
                    return result;
                });
            }
            return result;
        } else {
            return null;
        }
    }).catch((err) => {
        logger.error(`Error finding / updating [${token.platformDisplayName}] on [${token.platform}]: ${err}`);
        return null;
    });
};

let createPlayer = function(token) {
    return _getPlayerConfigFromOw(token).then((result) => {
        return new Player(result).save();
    });
};

let updatePlayer = function (token) {
    return _getPlayerConfigFromOw(token).then((result) => {
        return Player.findOneAndUpdate({
            platformDisplayName: token.platformDisplayName,
            platform: token.platform
        }, result, {new: true});
    });
};

let _getPlayerConfigFromOw = function (token) {
    return Promise.all([ow.getPlayerDetails(token), ow.getPlayerStats(token)]).then((results) => {
        let playerDetails = results[0];
        let heroDetails = results[1];

        owValidator.playerValidator(playerDetails);
        owValidator.careerValidator(heroDetails);

        return {
            platformDisplayName: token.platformDisplayName,
            platform: token.platform,
            lastUpdated: new Date(),
            level: playerDetails.level,
            portrait: playerDetails.portrait,
            skillRating: isNaN(heroDetails.stats.competitiveRank) ? 0 : heroDetails.stats.competitiveRank
        };
    });
};

module.exports = {
    findAndUpdatePlayer: cachingEnabled ?
        memoize(findAndUpdatePlayer, {promise: true, maxAge: 60000, normalizer: JSON.stringify}) :
        findAndUpdatePlayer,
    findOrCreatePlayer: cachingEnabled ?
        memoize(findOrCreatePlayer, {promise: true, maxAge: 60000, normalizer: JSON.stringify}) :
        findOrCreatePlayer,
    searchForPlayer,
    findAndDeletePlayer
};