let dependencyResolver = require('../devUtilities/DepedencyResolver');
let loggingUtilities = require('../devUtilities/LoggingUtilities');
let config = require('config');
let bluebird = require('bluebird');
let logger = require('winston');
let redis = dependencyResolver.redis;
let _ = require('lodash');

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

let removePlayerHerosByName = function (battleNetId, ...heroNames) {
    return new Promise((resolve) => {
        getPlayerHeros(battleNetId)
            .then((heros) => {
                let herosToRemove = [];
                for (let hero of heros) {
                    if (heroNames.indexOf(hero.heroName) > -1) {
                        herosToRemove.push(hero);
                    }
                }

                if (heroNames.length != herosToRemove.length) {
                    _.difference(heroNames, herosToRemove).forEach((heroName) => {
                        logger.warn(`Tried to remove nonexistant hero [${heroName}] from player:[${battleNetId}]`);
                    });
                }

                return resolve(client.srem(`users.${battleNetId}.heros`, ...herosToRemove));

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

let removeMetaHeros = function (rank, region, ...heros) {
    return new Promise((resolve) => {
        client.sremAsync(`${region}.${rank}.heros`, ...heros).then((removed) => {
            let heroNames = loggingUtilities.listOfObjectsToString(heros, 'heroName');
            if (removed != heros.length) {
                logger.warn(`Tried to remove one of the following heros that did not exist, {${heroNames}} from rank [${rank}] and region [${region}]`);
            }
            resolve();
        });
    });
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
    removePlayerHerosByName,
    getPlayerHeros,
    addMetaHero,
    removeMetaHeros,
    getMetaHeros,
    addPlayerInfo,
    deletePlayerInfo,
    getPlayerInfo
};