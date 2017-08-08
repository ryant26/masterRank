let serverEvents = require('../socketEvents/serverEvents');
let PlayerService = require('../services/PlayerService');
let BaseController = require('./BaseController');

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

        PlayerService.getPlayerRank(this.battleNetId, this.region).then((rankObj) => {
            this.rank = rankObj.rank;
            PlayerService.sendInitialData(this.battleNetId, this.rank, this.region, this.socket);
        });

        this.on(serverEvents.addHero, (data) => {
            PlayerService.addHeroByName(this.battleNetId, this.rank, this.region, this.namespace, data.eventData);
        });

        this.on(serverEvents.removeHero, (data) => {
            PlayerService.removePlayerHerosByName(this.battleNetId, this.rank, this.region, this.namespace, data.eventData);
        });

        this.on(serverEvents.disconnect, () => {
            PlayerService.removeAllPlayerHeros(this.battleNetId, this.rank, this.region, this.namespace);
        });
    }
};