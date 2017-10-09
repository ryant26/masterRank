const mongoose = require('mongoose');
const Player = mongoose.model('Player');
const logger = require('winston');
const ow = require('../apiClients/overwatch');
const owValidator = require('../validators/owApiValidator');

let searchForPlayer = function(token) {
    let queryCriteria = {
        $text: {$search: token.battleNetId},
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
        logger.error(`Error searching for player ${token.battleNetId}: ${err}`);
        throw err;
    });
};

let findOrCreatePlayer = function(token) {
    return findAndUpdatePlayer(token).then((player) => {
        if (!player) {
            return createPlayer(token).catch((err) => {
                logger.error(`Error creating player [${token.battleNetId}]: ${err}`);
                return null;
            });
        }

        return player;
    }).catch((err) => {
        logger.error(`Error finding/updating player [${token.battleNetId}]: ${err}`);
        return null;
    });
};

let findAndUpdatePlayer = function(token) {
    return Player.findOne({platformDisplayName: token.battleNetId, platform: token.platform}).then((result) => {
        if (result) {
            if (new Date(result.lastUpdated).setHours(result.lastUpdated.getHours() + 6) < new Date()) {
                return updatePlayer(token).catch((err) => {
                    logger.error(`Found player ${token.battleNetId} but failed to update: ${err}`);
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
            platformDisplayName: token.battleNetId,
            platform: token.platform,
            region: token.region
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
            platformDisplayName: token.battleNetId,
            platform: token.platform,
            lastUpdated: new Date(),
            level: playerDetails.level,
            portrait: playerDetails.portrait,
            region: token.region,
            skillRating: isNaN(heroDetails.stats.competitiveRank) ? 0 : heroDetails.stats.competitiveRank
        };
    });
};

module.exports = {
    findAndUpdatePlayer,
    findOrCreatePlayer,
    searchForPlayer
};