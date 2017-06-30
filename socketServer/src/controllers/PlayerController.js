let logger = require('winston');

/**
 * This module handles player API requests
 * @param config.socket - Socket
 * @param config.region - Region
 * @param config.PlayerClient - Player Client (Hero API)
 * @param config.RedisClient - Redis Client
 * @param config.io - Socket Server
 * @constructor
 */
const PlayerController = function(config) {
    let socket = config.socket;
    let token = socket.token;
    let region = config.region;
    let battleNetId = token.battleNetId;
    let playerClient = config.PlayerClient;
    let redisClient = config.RedisClient;
    let io = config.io;

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
            io.in(socket.rank).emit('heroAdded', heroObj);
        });
    });
};

module.exports = PlayerController;
