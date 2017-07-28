let logger = require('winston');
let clientEvents = require('../socketEvents/clientEvents');
let serverEvents = require('../socketEvents/serverEvents');

/**
 * This module handles player API requests
 * @param config.socket - Socket
 * @param config.region - Region
 * @param config.PlayerClient - Player Client (Hero API)
 * @param config.RedisClient - Redis Client
 * @param config.namespace - Socket Namespace
 * @constructor
 */
const PlayerController = function(config) {
    let socket = config.socket;
    let token = socket.token;
    let region = config.region;
    let battleNetId = token.battleNetId;
    let playerClient = config.PlayerClient;
    let redisClient = config.RedisClient;
    let namespace = config.namespace;
    let rank;

    playerClient.getPlayerRank(battleNetId, config.region).then((rankObj) => {
        rank = rankObj.rank;
        redisClient.addPlayerInfo(battleNetId, rankObj);
        socket.join(rank);
        logger.info(`Player [${battleNetId}] joined rank [${rank}]`);
        redisClient.getMetaHeros(rank, region).then((heros) => {
            socket.emit(clientEvents.initialData, heros);
        });
    });

    socket.on(serverEvents.addHero, (hero) => {
        playerClient.getHeroStats(battleNetId, config.region.name, hero).then((stats) => {
            let heroObj = {heroName: hero, stats, battleNetId: battleNetId};
            redisClient.addPlayerHero(battleNetId, heroObj);
            redisClient.addMetaHero(rank, region, heroObj);
            namespace.to(rank).emit(clientEvents.heroAdded, heroObj);
            logger.info(`Player [${battleNetId}] added hero [${hero}]`);
        });
    });

    socket.on(serverEvents.disconnect, () => {
        redisClient.getPlayerHeros(battleNetId).then((heros) => {
            let heroNames = heros.map((hero) => {return hero.heroName;});
            redisClient.removePlayerHerosByName(battleNetId, ...heroNames);
            redisClient.removeMetaHeros(rank, region, ...heros).then(() => {
                heros.forEach(hero => {
                    namespace.to(rank).emit(clientEvents.heroRemoved, hero);
                });
            });
            logger.info(`Player [${battleNetId}] left rank [${rank}]`);
        });
    });
};

module.exports = PlayerController;
