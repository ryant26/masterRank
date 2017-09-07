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

        this.player = {
            battleNetId: this.battleNetId,
            rank: this.rank,
            region: this.region,
            platform: this.platform,
            socket: this.socket,
            namespace: this.namespace
        };

        playerService.getPlayerRank(this.player).then((rankObj) => {
            this.rank = rankObj.rank;
            return playerService.sendInitialData(this.player);
        });

        this.on(serverEvents.addHero, (data) => {
            return playerService.addHeroByName(this.player, data.eventData);
        });

        this.on(serverEvents.removeHero, (data) => {
            return playerService.removePlayerHerosByName(this.player, data.eventData);
        });

        this.on(serverEvents.disconnect, () => {
            return playerService.removeAllPlayerHeros(this.player).then(() => {
                return playerService.removePlayerInfo(this.player);
            });
        });
    }
};