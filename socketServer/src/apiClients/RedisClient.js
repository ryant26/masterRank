const dependencyResolver = require('../devUtilities/DepedencyResolver');
const loggingUtilities = require('../devUtilities/LoggingUtilities');
const config = require('config');
const bluebird = require('bluebird');
const logger = require('winston');
const redis = dependencyResolver.redis;
bluebird.promisifyAll(redis.RedisClient.prototype);

let redisKeys = {
    userHeros: function(battleNetId) {
        return `users.${battleNetId}.heros`;
    },

    rankHeros: function(region, rank) {
        return `${region}.${rank}.heros`;
    },

    playerInfo: function(battleNetId) {
        return `users.${battleNetId}.info`;
    },

    groups: 'groups',

    groupLeader: function(groupId) {
        return `groups.${groupId}.leader`;
    },
    
    groupPending: function (groupId) {
        return `groups.${groupId}.pending`;
    },

    groupMembers: function(groupId) {
        return `groups.${groupId}.members`;
    }
};

let redisUrl = config.get('redisUrl');
logger.info(`Opening new connection to redis [${redisUrl}]`);

let client = redis.createClient({
    url: redisUrl
});

let addPlayerHero = function (battleNetId, hero) {
    return new Promise((resolve) => {
        resolve(client.saddAsync(redisKeys.userHeros(battleNetId), JSON.stringify(hero)));
    });
};

let removePlayerHeros = function(battleNetId, ...heros) {
    return new Promise((resolve) => {
        let heroStrings = heros.map((hero) => {
            return JSON.stringify(hero);
        });
        client.sremAsync(redisKeys.userHeros(battleNetId), heroStrings).then((removed) => {
            if (removed !== heros.length) {
                logger.warn(`Tried to remove [${heros.length}] heros from player:[${battleNetId}], only removed [${removed}]`);
            }
            resolve();
        });
    });
};

let getPlayerHeros = function(battleNetId) {
    return getJsonList(redisKeys.userHeros(battleNetId));
};

let addMetaHero = function (rank, region, hero) {
    return new Promise((resolve) => {
        resolve(client.saddAsync(redisKeys.rankHeros(region, rank), JSON.stringify(hero)));
    });
};

let removeMetaHeros = function (rank, region, ...heros) {
    return new Promise((resolve) => {
        let heroStrings = heros.map((hero) => {
            return JSON.stringify(hero);
        });
        client.sremAsync(redisKeys.rankHeros(region, rank), heroStrings).then((removed) => {
            let heroNames = loggingUtilities.listOfObjectsToString(heros, 'heroName');
            if (removed != heros.length) {
                logger.warn(`Tried to remove one of the following heros that did not exist, {${heroNames}} from rank [${rank}] and region [${region}]`);
            }
            resolve();
        });
    });
};

let getMetaHeros = function(rank, region) {
    return getJsonList(redisKeys.rankHeros(region, rank));
};

let addPlayerInfo = function (battleNetId, information) {
    return client.setAsync(redisKeys.playerInfo(battleNetId), JSON.stringify(information));
};

let deletePlayerInfo = function (battleNetId) {
    return client.delAsync(redisKeys.playerInfo(battleNetId));
};

let getPlayerInfo = function (battleNetId) {
    return new Promise((resolve) => {
        client.getAsync(redisKeys.playerInfo(battleNetId))
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
    return client.incrAsync(redisKeys.groups);
};

let setGroupLeader = function (groupId, hero) {
    return client.setAsync(redisKeys.groupLeader(groupId), JSON.stringify(hero));
};

let getGroupLeader = function (groupId) {
    return new Promise((resolve) => {
        client.getAsync(redisKeys.groupLeader(groupId)).then((leader) => {
            resolve(JSON.parse(leader));
        });
    });
};

let deleteGroupLeader = function (groupId) {
    return client.delAsync(redisKeys.groupLeader(groupId));
};

let addHeroToGroupPending = function (groupId, hero) {
    return client.saddAsync(redisKeys.groupPending(groupId), JSON.stringify(hero));
};

let removeHeroFromGroupPending = function (groupId, hero) {
    return client.sremAsync(redisKeys.groupPending(groupId), JSON.stringify(hero));
};

let getGroupPendingHeros = function (groupId) {
    return getJsonList(redisKeys.groupPending(groupId));
};

let deleteGroupPending = function (groupId) {
    return client.delAsync(redisKeys.groupPending(groupId));
};

let addHeroToGroupMembers = function (groupId, hero) {
    return client.saddAsync(redisKeys.groupMembers(groupId), JSON.stringify(hero));
};

let removeHeroFromGroupMembers = function (groupId, hero) {
    return client.sremAsync(redisKeys.groupMembers(groupId), JSON.stringify(hero));
};

let getGroupMemberHeros = function (groupId) {
    return getJsonList(redisKeys.groupMembers(groupId));
};

let deleteGroupMembers = function (groupId) {
    return client.delAsync(redisKeys.groupMembers(groupId));
};

let deleteGroup = function (groupId) {
    return Promise.all([deleteGroupLeader(groupId), deleteGroupPending(groupId), deleteGroupMembers(groupId)]);
};

let getGroupDetails = function(groupId) {
    let groupDetails = {
        groupId
    };

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
    return client.smembersAsync(key)
        .then((data) => {
            let out = [];
            if (data) {
                out = data.map((hero) => {
                    return JSON.parse(hero);
                });
            }
            return out;
        });
};

module.exports = {
    addPlayerHero,
    removePlayerHeros,
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
    getGroupDetails,
    deleteGroup
};