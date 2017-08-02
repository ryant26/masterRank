let logger = require('winston');
let clientEvents = require('../socketEvents/clientEvents');
let PlayerClient = require('../apiClients/PlayerClient');
let RedisClient = require('../apiClients/RedisClient');

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

let getPlayerRank = function (battleNetId, region) {
    return PlayerClient.getPlayerRank(battleNetId, region);
};

let addHeroByName = function(battleNetId, rank, region, namespace, heroName) {
    PlayerClient.getHeroStats(battleNetId, region.name, heroName).then((stats) => {
        let heroObj = {heroName: heroName, stats, battleNetId: battleNetId};
        RedisClient.addPlayerHero(battleNetId, heroObj);
        RedisClient.addMetaHero(rank, region, heroObj);
        namespace.to(rank).emit(clientEvents.heroAdded, heroObj);
        logger.info(`Player [${battleNetId}] added hero [${heroName}]`);
    });
};

let removeAllPlayerHeros = function(battleNetId, rank, region, namespace) {
    RedisClient.getPlayerHeros(battleNetId).then((heros) => {
        return removePlayerHeros(battleNetId, rank, region, namespace, ...heros);
    });
};

let removePlayerHeros = function(battleNetId, rank, region, namespace, ...heros) {
    RedisClient.removePlayerHeros(battleNetId, ...heros);
    RedisClient.removeMetaHeros(rank, region, ...heros).then(() => {
        heros.forEach(hero => {
            namespace.to(rank).emit(clientEvents.heroRemoved, hero);
        });
    });
    logger.info(`Player [${battleNetId}] left rank [${rank}]`);
};

module.exports = {
    sendInitialData,
    getPlayerRank,
    addHeroByName,
    removePlayerHeros,
    removeAllPlayerHeros
};