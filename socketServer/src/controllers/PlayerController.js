const serverEvents = require('../socketEvents/serverEvents');
const playerService = require('../services/playerService');
const BaseController = require('./BaseController');

/**
 * This module handles player API requests
 * @param config.socket - Socket
 * @param config.region - Region
 * @param config.PlayerClient - Player Client (Hero API)
 * @param config.RedisClient - Redis Client
 * @param config.namespace - Socket Namespace
 * @constructor
 */
module.exports = class PlayerController extends BaseController{
    constructor (config) {
        super(config);

        playerService.getPlayerRank(this.token).then((rankObj) => {
            this.rank = rankObj.rank;
            return playerService.sendInitialData(this.token, this.rank, this.socket);
        });

        this.on(serverEvents.addHero, (data) => {
            return playerService.addHeroByName(this.token, this.rank, this.namespace, data.eventData);
        });

        this.on(serverEvents.removeHero, (data) => {
            return playerService.removePlayerHerosByName(this.token, this.rank, this.namespace, data.eventData);
        });

        this.on(serverEvents.disconnect, () => {
            return playerService.removeAllPlayerHeros(this.token, this.rank, this.namespace).then(() => {
                return playerService.removePlayerInfo(this.token);
            });
        });
    }
};