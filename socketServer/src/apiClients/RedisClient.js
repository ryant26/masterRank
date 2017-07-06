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
    return getJsonList(`users.${battleNetId}.heros`);
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
    return getJsonList(`${region}.${rank}.heros`);
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

let createNewGroup = function() {
    return client.incrAsync('groups');
};

let setGroupLeader = function (groupId, battleNetId) {
    return client.setAsync(`groups.${groupId}.leader`, battleNetId);
};

let getGroupLeader = function (groupId) {
    return client.getAsync(`groups.${groupId}.leader`);
};

let addHeroToGroupPending = function (groupId, hero) {
    return client.saddAsync(`groups.${groupId}.pending`, hero);
};

let removeHeroFromGroupPending = function (groupId, hero) {
    return client.sremAsync(`groups.${groupId}.pending`, hero);
};

let getGroupPendingHeros = function (groupId) {
    return getJsonList(`groups.${groupId}.pending`);
};

let addHeroToGroupMembers = function (groupId, hero) {
    return client.saddAsync(`groups.${groupId}.members`, hero);
};

let removeHeroFromGroupMembers = function (groupId, hero) {
    return client.sremAsync(`groups.${groupId}.members`, hero);
};

let getGroupMemberHeros = function (groupId) {
    return getJsonList(`groups.${groupId}.members`);
};

let getGroupDetails = function(groupId) {
    let groupDetails = {};

    let groupLeader = getGroupLeader(groupId).then((leader) => {
        groupDetails.leader = leader;
    });

    let groupMembers = getGroupMemberHeros(groupId).then((members) => {
        groupDetails.members = members;
    });

    let groupPending = getGroupPendingHeros(groupId).then((pending) => {
        groupDetails.pending = pending;
    });

    return Promise.all([groupLeader, groupMembers, groupPending]).then(() => {
        return groupDetails;
    });
};

let getJsonList = function (key) {
    return new Promise((resolve) => {
        client.smembersAsync(key)
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

module.exports = {
    addPlayerHero,
    removePlayerHerosByName,
    getPlayerHeros,
    addMetaHero,
    removeMetaHeros,
    getMetaHeros,
    addPlayerInfo,
    deletePlayerInfo,
    getPlayerInfo,
    createNewGroup,
    setGroupLeader,
    addHeroToGroupPending,
    removeHeroFromGroupPending,
    addHeroToGroupMembers,
    removeHeroFromGroupMembers,
    getGroupDetails
};