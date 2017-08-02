let logger = require('winston');
let clientEvents = require('../socketEvents/clientEvents');
let PlayerClient = require('../apiClients/PlayerClient');
let RedisClient = require('../apiClients/RedisClient');

/**
 * Fires the initialData event on the client and provides the hero Meta lists
 * @param battleNetId
 * @param rank
 * @param region
 * @param socket
 */
let sendInitialData = function (battleNetId, rank, region, socket) {
    PlayerClient.getPlayerRank(battleNetId, region).then((rankObj) => {
        let rank = rankObj.rank;
        RedisClient.addPlayerInfo(battleNetId, rankObj);
        socket.join(rank);
        logger.info(`Player [${battleNetId}] joined rank [${rank}]`);
        RedisClient.getMetaHeros(rank, region).then((heros) => {
            socket.emit(clientEvents.initialData, heros);
        });
    });
};

/**
 * Adds a hero to a player and the Meta lists by name (looks up stats)
 * @param battleNetId
 * @param rank
 * @param region
 * @param namespace
 * @param heroName
 */
let addHeroByName = function(battleNetId, rank, region, namespace, heroName) {
    PlayerClient.getHeroStats(battleNetId, region.name, heroName).then((stats) => {
        let heroObj = {heroName: heroName, stats, battleNetId: battleNetId};
        RedisClient.addPlayerHero(battleNetId, heroObj);
        RedisClient.addMetaHero(rank, region, heroObj);
        namespace.to(rank).emit(clientEvents.heroAdded, heroObj);
        logger.info(`Player [${battleNetId}] added hero [${heroName}]`);
    });
};

/**
 * Removes all heros that a player has added from meta lists and player
 * @param battleNetId
 * @param rank
 * @param region
 * @param namespace
 */
let removeAllPlayerHeros = function(battleNetId, rank, region, namespace) {
    RedisClient.getPlayerHeros(battleNetId).then((heros) => {
        return removePlayerHeros(battleNetId, rank, region, namespace, ...heros);
    });
};

/**
 * Removes the specified heros from the player and the meta lists
 * @param battleNetId
 * @param rank
 * @param region
 * @param namespace
 * @param heros
 */
let removePlayerHeros = function(battleNetId, rank, region, namespace, ...heros) {
    RedisClient.removePlayerHeros(battleNetId, ...heros);
    RedisClient.removeMetaHeros(rank, region, ...heros).then(() => {
        heros.forEach(hero => {
            namespace.to(rank).emit(clientEvents.heroRemoved, hero);
        });
    });
    logger.info(`Player [${battleNetId}] left rank [${rank}]`);
};

let getPlayerRank = function (battleNetId, region) {
    return PlayerClient.getPlayerRank(battleNetId, region);
};

module.exports = {
    sendInitialData,
    getPlayerRank,
    addHeroByName,
    removePlayerHeros,
    removeAllPlayerHeros
};