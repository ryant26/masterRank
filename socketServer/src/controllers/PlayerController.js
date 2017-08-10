let serverEvents = require('../socketEvents/serverEvents');
let PlayerService = require('../services/PlayerService');

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
    let namespace = config.namespace;
    let rank;

    PlayerService.getPlayerRank(battleNetId, region).then((rankObj) => {
        rank = rankObj.rank;
        PlayerService.sendInitialData(battleNetId, rank, region, socket);
    });

    socket.on(serverEvents.addHero, (hero) => {
        PlayerService.addHeroByName(battleNetId, rank, region, namespace, hero);
    });

    socket.on(serverEvents.disconnect, () => {
        PlayerService.removeAllPlayerHeros(battleNetId, rank, region, namespace);
    });
};

module.exports = PlayerController;
