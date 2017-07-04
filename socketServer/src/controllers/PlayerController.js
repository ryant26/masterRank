let logger = require('winston');

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

    playerClient.getPlayerRank(battleNetId, config.region).then((rankObj) => {
        redisClient.addPlayerInfo(battleNetId, rankObj);
        socket.join(rankObj.rank);
        socket.rank = rankObj.rank;
        logger.info(`Player [${battleNetId}] joined rank [${rankObj.rank}]`);
        redisClient.getMetaHeros(rankObj.rank, region).then((heros) => {
            socket.emit('initialData', heros);
        });
    });

    socket.on('addHero', (hero) => {
        playerClient.getHeroStats(battleNetId, config.region.name, hero).then((stats) => {
            let heroObj = {heroName: hero, stats, battleNetId: battleNetId};
            redisClient.addPlayerHero(battleNetId, heroObj);
            redisClient.addMetaHero(socket.rank, region, heroObj);
            namespace.to(socket.rank).emit('heroAdded', heroObj);
        });
    });

    socket.on('disconnect', () => {
        redisClient.getPlayerHeros(battleNetId).then((heros) => {
            let heroNames = heros.map((hero) => {return hero.heroName;});
            redisClient.removePlayerHerosByName(battleNetId, ...heroNames);
            heros.forEach((hero) => {
                redisClient.removeMetaHero(socket.rank, region, hero).then(() => {
                    namespace.to(socket.rank).emit('heroRemoved', hero);
                });
            });
        });
    });
};

module.exports = PlayerController;
