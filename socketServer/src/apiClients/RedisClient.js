let dependencyResolver = require('../devUtilities/DepedencyResolver');
let config = require('config');
let bluebird = require('bluebird');
let logger = require('winston');
let redis = dependencyResolver.redis;

bluebird.promisifyAll(redis.RedisClient.prototype);
// bluebird.promisifyAll(redis.Multi.prototype);

let RedisClient = function() {
    let self = this;
    this.redisUrl = config.get('redisUrl');
    logger.info(`Opening new connection to redis [${self.redisUrl}]`);

    let client = redis.createClient({
        url: self.redisUrl
    });

    this.addHero = function (battleNetId, hero) {
        return new Promise((resolve) => {
            let data = {
                hero,
                stats: {}
            };

            resolve(client.saddAsync(`users.${battleNetId}.heros`, JSON.stringify(data)));
        });
    };

    this.removeHero = function (battleNetId, heroName) {
        return new Promise((resolve) => {
            self.getPlayerHeros(battleNetId)
                .then((heros) => {
                    for (let hero of heros) {
                        if (hero.hero === heroName) {
                            resolve(client.srem(`users.${battleNetId}.heros`, hero));
                            return;
                        }
                    }
                    logger.warn(`Tried to remove nonexistant hero [${heroName}] from player:[${battleNetId}]`);
                    resolve();
                });
        });
    };

    this.getPlayerHeros = function(battleNetId) {
        return new Promise((resolve) => {
            client.smembersAsync(`users.${battleNetId}.heros`)
                .then((data) => {
                    let out = [];
                    if (data) {
                        out = data.map((hero) => {
                            return JSON.parse(hero);
                        });
                    }
                    resolve(out);
                });
        });
    };

    this.addPlayerInfo = function (battleNetId, information) {
        return client.setAsync(`users.${battleNetId}.info`, JSON.stringify(information));
    };

    this.deletePlayerInfo = function (battleNetId) {
        return client.delAsync(`users.${battleNetId}.info`);
    };

    this.getPlayerInfo = function (battleNetId) {
        return new Promise((resolve) => {
            client.getAsync(`users.${battleNetId}.info`)
                .then((data) => {
                    let out = null;
                    if(data) {
                        out = JSON.parse(data);
                    }
                    resolve(out);
                });
        });
    };
};

module.exports = RedisClient;