const serverEvents = require('../socketEvents/serverEvents');
const playerService = require('../services/playerService');
const BaseController = require('./BaseController');
const logger = require('../services/logger').sysLogger;
const SocketError = require('../validators/exceptions/SocketError');
const exceptions = require('../validators/exceptions/exceptions');

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

        playerService.getPlayerRank(this.token).then((rank) => {
            this.rank = rank;
            return playerService.sendInitialData(this.token, this.rank, this.socket);
        });

        this.on(serverEvents.addHero, (data) => {
            return playerService.addHeroByName(this.token, this.rank, this.namespace, data.eventData).catch((err) => {
                logger.error(`Error adding hero ${data.eventData.heroName}: ${err}`);
                throw new SocketError(exceptions.errorAddingHero, 'heroName', data.eventData.heroName);
            });
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