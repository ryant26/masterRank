let dependencyResolver = require('../devUtilities/DepedencyResolver');
let config = require('config');
let bluebird = require('bluebird');
let logger = require('winston');
let redis = dependencyResolver.redis;

bluebird.promisifyAll(redis.RedisClient.prototype);


let redisUrl = config.get('redisUrl');
logger.info(`Opening new connection to redis [${redisUrl}]`);

let client = redis.createClient({
    url: redisUrl
});

let addPlayerHero = function (battleNetId, hero) {
    return new Promise((resolve) => {
        resolve(client.saddAsync(`users.${battleNetId}.heros`, JSON.stringify(hero)));
    });
};

let removePlayerHeroByName = function (battleNetId, heroName) {
    return new Promise((resolve) => {
        getPlayerHeros(battleNetId)
            .then((heros) => {
                for (let hero of heros) {
                    if (hero.heroName === heroName) {
                        resolve(client.srem(`users.${battleNetId}.heros`, hero));
                        return;
                    }
                }
                logger.warn(`Tried to remove nonexistant hero [${heroName}] from player:[${battleNetId}]`);
                resolve();
            });
    });
};

let getPlayerHeros = function(battleNetId) {
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

let addMetaHero = function (rank, region, hero) {
    return new Promise((resolve) => {
        resolve(client.saddAsync(`${region}.${rank}.heros`, JSON.stringify(hero)));
    });
};

let removeMetaHero = function (rank, region, hero) {
    return client.srem(`${region}.${rank}.heros`, hero);
};

let getMetaHeros = function(rank, region) {
    return new Promise((resolve) => {
        client.smembersAsync(`${region}.${rank}.heros`)
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

let addPlayerInfo = function (battleNetId, information) {
    return client.setAsync(`users.${battleNetId}.info`, JSON.stringify(information));
};

let deletePlayerInfo = function (battleNetId) {
    return client.delAsync(`users.${battleNetId}.info`);
};

let getPlayerInfo = function (battleNetId) {
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

module.exports = {
    addPlayerHero,
    removePlayerHeroByName,
    getPlayerHeros,
    addMetaHero,
    removeMetaHero,
    getMetaHeros,
    addPlayerInfo,
    deletePlayerInfo,
    getPlayerInfo
};