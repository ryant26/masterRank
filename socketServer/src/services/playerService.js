const logger = require('./logger').sysLogger;
const clientEvents = require('../socketEvents/clientEvents');
const PlayerClient = require('../apiClients/PlayerClient');
const RedisClient = require('../apiClients/RedisClient');
const SocketError = require('../validators/exceptions/SocketError');
const exceptions = require('../validators/exceptions/exceptions');
const _ = require('lodash');

/**
 * Fires the initialData event on the client and provides the hero Meta lists
 * @param token
 * @param rank
 * @param socket
 */
let sendInitialData = function (token, rank, socket) {
    return PlayerClient.getPlayerRank(token.platformDisplayName, token.region, token.platform).then((rankObj) => {
        let rank = rankObj.rank;
        RedisClient.addPlayerInfo(token.platformDisplayName, token.platform, rankObj);
        socket.join(rank);
        logger.info(`Player [${token.platformDisplayName}] joined rank [${rank}]`);
        return RedisClient.getMetaHeros(rank, token.platform, token.region);
    }).then((heros) => {
        socket.emit(clientEvents.initialData, heros);
    });
};

/**
 * Adds a hero to a player and the Meta lists by name (looks up stats)
 * @param token
 * @param rank
 * @param namespace
 * @param clientData
 */
let addHeroByName = function(token, rank, namespace, clientData) {
    let heroStats;
    return Promise.all([
        PlayerClient.getHeroStats(token.platformDisplayName, token.region, token.platform, clientData.heroName),
        RedisClient.getPlayerHeros(token.platformDisplayName, token.platform)
    ]).then((results) => {

        if (results[1].length >= 10) {
            throw `Player [${token.platformDisplayName}] has too many heroes`;
        }

        heroStats = results[0];
        heroStats.priority = clientData.priority;
        return Promise.all([RedisClient.addPlayerHero(token.platformDisplayName, token.platform, heroStats),
            RedisClient.addMetaHero(rank, token.platform, token.region, heroStats)]);
    }).then(() => {
        namespace.to(rank).emit(clientEvents.heroAdded, heroStats);
        logger.info(`Player [${token.platformDisplayName}] added hero [${clientData.heroName}]`);
    });
};

/**
 * Removes all heros that a player has added from meta lists and player
 * @param token
 * @param rank
 * @param namespace
 */
let removeAllPlayerHeros = function(token, rank, namespace) {
    return RedisClient.getPlayerHeros(token.platformDisplayName, token.platform).then((heros) => {
        return removePlayerHeros(token, rank, namespace, ...heros);
    });
};

/**
 * Removes the specified heros (by name) from the player and meta lists
 * @param rank
 * @param namespace
 * @param names
 */
let removePlayerHerosByName = function(token, rank, namespace, ...names) {
    return RedisClient.getPlayerHeros(token.platformDisplayName, token.platform).then((heros) => {
        let herosToRemove = heros.filter((hero) => {
            return _.includes(names, hero.heroName);
        });

        if(herosToRemove.length !== names.length) {
            logger.warn(`Tried to remove [${names.length}] heros from player:[${token.platformDisplayName}], only removed [${herosToRemove.length}]`);
        }

        return removePlayerHeros(token, rank, namespace, ...herosToRemove);
    });
};

/**
 * Removes the specified heros from the player and the meta lists
 * @param token
 * @param rank
 * @param namespace
 * @param heros
 */
let removePlayerHeros = function(token, rank, namespace, ...heros) {
    return new Promise((resolve) => {
        if (heros.length){
            resolve(Promise.all([RedisClient.removePlayerHeros(token.platformDisplayName, token.platform, ...heros),
                RedisClient.removeMetaHeros(rank, token.platform, token.region, ...heros)]).then(() => {
                heros.forEach(hero => {
                    namespace.to(rank).emit(clientEvents.heroRemoved, hero);
                });
                logger.info(`Player [${token.platformDisplayName}] left rank [${rank}]`);
            }));
        } else {
            resolve();
        }
    });
};

let removePlayerInfo = function(token) {
    return RedisClient.deletePlayerInfo(token.platformDisplayName, token.platform);
};

let getPlayerRank = function (token) {
    return PlayerClient.getPlayerRank(token.platformDisplayName, token.region, token.platform);
};

module.exports = {
    sendInitialData,
    getPlayerRank,
    addHeroByName,
    removePlayerHeros,
    removePlayerHerosByName,
    removeAllPlayerHeros,
    removePlayerInfo
};