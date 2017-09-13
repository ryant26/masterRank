const loggingUtilities = require('../devUtilities/LoggingUtilities');
const config = require('config');
const bluebird = require('bluebird');
const logger = require('winston');
const redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let redisKeys = {
    userHeros: function(battleNetId, platform) {
        return `users.${platform}.${battleNetId}.heros`;
    },

    rankHeros: function(region, platform, rank) {
        return `${region}.${platform}.${rank}.heros`;
    },

    playerInfo: function(battleNetId, platform) {
        return `users.${battleNetId}.${platform}.info`;
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
    },

    groupId: function(battleNetId, platform) {
        return `groups.${battleNetId}.${platform}.groupId`;
    }
};

let timeToLive = config.get('keyExpiry');

let redisUrl = config.get('redisUrl');
logger.info(`Opening new connection to redis [${redisUrl}]`);

let client = redis.createClient({
    url: redisUrl
});

let addPlayerHero = function (battleNetId, platform, hero) {
    return new Promise((resolve) => {
        let key = redisKeys.userHeros(battleNetId, platform);
        resolve(client.multi().sadd(key, JSON.stringify(hero)).expire(key, timeToLive).execAsync());
    });
};

let removePlayerHeros = function(battleNetId, platform, ...heros) {
    return new Promise((resolve) => {
        let heroStrings = heros.map((hero) => {
            return JSON.stringify(hero);
        });
        client.sremAsync(redisKeys.userHeros(battleNetId, platform), ...heroStrings).then((removed) => {
            if (removed !== heros.length) {
                logger.warn(`Tried to remove [${heros.length}] heros from player:[${battleNetId}], only removed [${removed}]`);
            }
            resolve();
        });
    });
};

let getPlayerHeros = function(battleNetId, platform) {
    return getJsonList(redisKeys.userHeros(battleNetId, platform));
};

let addMetaHero = function (rank, platform, region, hero) {
    return new Promise((resolve) => {
        let key = redisKeys.rankHeros(region, platform, rank);
        resolve(client.multi().sadd(key, JSON.stringify(hero)).expire(key, timeToLive).execAsync());
    });
};

let removeMetaHeros = function (rank, platform, region, ...heros) {
    return new Promise((resolve) => {
        let heroStrings = heros.map((hero) => {
            return JSON.stringify(hero);
        });
        client.sremAsync(redisKeys.rankHeros(region, platform, rank), ...heroStrings).then((removed) => {
            let heroNames = loggingUtilities.listOfObjectsToString(heros, 'heroName');
            if (removed !== heros.length) {
                logger.warn(`Tried to remove one of the following heros that did not exist, {${heroNames}} from rank [${rank}] and region [${region}]`);
            }
            resolve();
        });
    });
};

let getMetaHeros = function(rank, platform, region) {
    return getJsonList(redisKeys.rankHeros(region, platform, rank));
};

let addPlayerInfo = function (battleNetId, platform, information) {
    return client.setexAsync(redisKeys.playerInfo(battleNetId, platform), timeToLive, JSON.stringify(information));
};

let deletePlayerInfo = function (battleNetId, platform) {
    return client.delAsync(redisKeys.playerInfo(battleNetId, platform));
};

let getPlayerInfo = function (battleNetId, platform) {
    return new Promise((resolve) => {
        client.getAsync(redisKeys.playerInfo(battleNetId, platform))
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

let getGroupId = function(battleNetId, platform) {
    return client.getAsync(redisKeys.groupId(battleNetId, platform));
};

let setGroupId = function (battleNetId, platform, groupId) {
    return client.setexAsync(redisKeys.groupId(battleNetId, platform), timeToLive, groupId);
};

let deleteGroupId = function(battleNetId, platform) {
    return client.delAsync(redisKeys.groupId(battleNetId, platform));
};

let setGroupLeader = function (groupId, hero) {
    return client.setexAsync(redisKeys.groupLeader(groupId), timeToLive, JSON.stringify(hero));
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
    let key = redisKeys.groupPending(groupId);
    return client.multi().sadd(key, JSON.stringify(hero)).expire(key, timeToLive).execAsync();
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

let moveHeroFromPendingToMembers = function (groupId, hero) {
    return client.watchAsync(redisKeys.groupLeader(groupId)).then(() => {
        let heroString = JSON.stringify(hero);
        return client.multi().srem(redisKeys.groupPending(groupId), heroString)
            .sadd(redisKeys.groupMembers(groupId), heroString)
            .expire(redisKeys.groupMembers(groupId), timeToLive)
            .execAsync();
    });
};

let addHeroToGroupMembers = function (groupId, hero) {
    let key = redisKeys.groupMembers(groupId);
    return client.multi().sadd(key, JSON.stringify(hero)).expire(key, timeToLive).execAsync();
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

let replaceGroupLeaderWithMember = function (groupId) {
    return client.watchAsync(redisKeys.groupMembers(groupId)).then(() => {
        return getGroupDetails(groupId);
    }).then((details) => {
        let newLeader = JSON.stringify(details.members[0]);
        return client.multi().setex(redisKeys.groupLeader(groupId), timeToLive, newLeader)
            .srem(redisKeys.groupMembers(groupId), newLeader)
            .execAsync();
    });
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
    getGroupId,
    setGroupId,
    deleteGroupId,
    setGroupLeader,
    addHeroToGroupPending,
    removeHeroFromGroupPending,
    moveHeroFromPendingToMembers,
    addHeroToGroupMembers,
    removeHeroFromGroupMembers,
    getGroupDetails,
    deleteGroup,
    replaceGroupLeaderWithMember
};