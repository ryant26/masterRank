const mongoose = require('mongoose');
const Player = mongoose.model('Player');
const logger = require('winston');
const ow = require('../apiClients/overwatch');

let findOrCreatePlayer = function(token) {
    return findAndUpdatePlayer(token).then((player) => {
        if (!player) {
            return createPlayer(token);
        }

        return player;
    });
};

let findAndUpdatePlayer = function(token) {
    return Player.findOne({platformDisplayName: token.battleNetId, platform: token.platform}).then((result) => {
        if (result) {
            let adjustedDate = new Date()
            if (new Date().setHours(result.lastUpdated.getHours() + 6) < Date.now()) {
                return updatePlayer(token);
            }
            return result;
        } else {
            return null;
        }
    }).catch((err) => {
        logger.error(`Error finding / updating [${token.platformDisplayName}] on [${token.platform}]: ${err}`);
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
    findOrCreatePlayer
};