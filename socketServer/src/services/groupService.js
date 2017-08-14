let logger = require('winston');
let clientEvents = require('../socketEvents/clientEvents');
let PlayerClient = require('../apiClients/PlayerClient');
let RedisClient = require('../apiClients/RedisClient');
let exceptions = require('../validators/exceptions/exceptions');
let SocketError = require('../validators/exceptions/SocketError');

/**
 * Creates a new group with a group leader (hero)
 */
let createNewGroup = function (battleNetId, region, socket, namespace, hero) {
    let groupId;

    return RedisClient.createNewGroup().then((id) => {
        groupId = id;
        addSocketToGroupRoom(groupId, socket);
        logger.info(`${battleNetId} created new group ${id}`);
        return PlayerClient.getHeroStats(battleNetId, region, hero.heroName);
    }).then((heroStats) => {
        return _setNewGroupLeader(groupId, namespace, heroStats);
    }).then(() => {
        return groupId;
    }).catch((err) => {
        logger.error(`Problem creating group: ${err}`);
        throw err;
    });
};



/**
 * Invite hero to group
 * @param player.battleNetId
 */
let invitePlayerToGroup = function(battleNetId, groupId, socket, namespace, hero) {
    return RedisClient.getPlayerHeros(hero.battleNetId).then((heros) => {
        logger.info(`Invited hero ${hero.battleNetId}:${hero.heroName} to group ${groupId}`);

        let heroStats = heros.find((element) => {
            return element.heroName === hero.heroName;
        });

        return RedisClient.addHeroToGroupPending(groupId, heroStats);
    }).then(() => {
        return RedisClient.getGroupDetails(groupId);
    }).then((groupDetails) => {
        socket.to(getPlayerRoom(hero.battleNetId)).emit(clientEvents.groupInviteReceived, groupDetails);
        namespace.to(getGroupRoom(groupId)).emit(clientEvents.playerInvited, groupDetails);
    }).catch((err) => {
        logger.error(`Problem inviting ${hero.battleNetId}:${hero.heroName} to group ${groupId}: ${err}`);
        throw err;
    });
};

/**
 * Accept an invite to a group
 * @param battleNetId
 * @param groupId
 * @param socket
 * @param namespace
 * @returns {Promise.<TResult>}
 */
let acceptGroupInvite = function (battleNetId, groupId, socket, namespace) {
    return RedisClient.getGroupDetails(groupId).then((details) => {
        let hero = getHeroFromListById(details.pending, battleNetId);
        return Promise.all([RedisClient.removeHeroFromGroupPending(groupId, hero), RedisClient.addHeroToGroupMembers(groupId, hero)]);
    }).then(() => {
        addSocketToGroupRoom(groupId, socket);
        return RedisClient.getGroupDetails(groupId);
    }).then((details) => {
        namespace.to(getGroupRoom(groupId)).emit(clientEvents.groupInviteAccepted, details);
    }).catch((err) => {
        logger.error(`${battleNetId} encountered a problem accepting invite to ${groupId}: ${err}`);
        throw err;
    });
};

/**
 * Removes the player with the passed ID from the group (including leaders)
 * @param battleNetId
 * @param groupId
 * @param socket
 * @param namespace
 * @returns {Promise}
 */
let removePlayerFromGroup = function (battleNetId, groupId, socket, namespace) {
    return new Promise((resolve) => {
        RedisClient.getGroupDetails(groupId).then((groupDetails) => {
            if (groupDetails.leader.battleNetId === battleNetId) {
                if (groupDetails.members.length > 0) {
                    resolve(_replaceGroupLeaderWithMember(groupId, namespace));
                } else {
                    resolve(_deleteGroup(groupId, namespace));
                }
            } else {
                let hero = getHeroFromListById(groupDetails.members, battleNetId);
                resolve(_removeHeroFromMembers(groupId, namespace, hero));
            }
        });
    }).then(() => {
        socket.leave(getGroupRoom(groupId));
        this.groupId = null;
    }).catch((err) => {
        logger.error(`Encountered a problem removing player [${battleNetId}] from group [${groupId}]: ${err}`);
        throw err;
    });
};

/**
 * This function removes a hero from the group pending list of the passed groupId.
 * Fires the events: groupInviteDeclined, error.groupInviteDecline
 * @param battleNetId
 * @param groupId
 * @param socket
 * @param namespace
 * @returns {Promise}
 */
let removePlayerFromGroupPending = function (battleNetId, groupId, socket, namespace) {
    return RedisClient.getGroupDetails(groupId).then((details) => {
        let hero = getHeroFromListById(details.pending, battleNetId);
        return RedisClient.removeHeroFromGroupPending(groupId, hero);
    }).then(() => {
        return RedisClient.getGroupDetails(groupId);
    }).then((details) => {
        namespace.to(getGroupRoom(groupId)).emit(clientEvents.groupInviteDeclined, details);
    }).catch((err) => {
        logger.error(`Encountered a problem removing player [${battleNetId}] from group [${groupId}]: ${err}`);
        throw err;
    });
};

/**
 * This function sets the group leader and fires the group promoted to leader event
 * @param groupId
 * @param namespace
 * @param hero
 * @returns {Promise}
 * @private
 */
let _setNewGroupLeader = function(groupId, namespace, hero) {
    return RedisClient.setGroupLeader(groupId, hero).then(() => {
        return RedisClient.getGroupDetails(groupId);
    }).then((groupDetails) => {
        namespace.to(getGroupRoom(groupId)).emit(clientEvents.groupPromotedLeader, groupDetails);
        return groupDetails;
    }).catch((err) => {
        logger.error(`Problem setting new group [${groupId}] leader: ${err}`);
        throw err;
    });
};

/**
 * This function removes the current group leader,
 * sets the new leader (fires groupNewLeader event). Removes that hero from the members list.
 * @param groupId
 * @param namespace
 * @returns {Promise}
 * @private
 */
let _replaceGroupLeaderWithMember = function(groupId, namespace) {
    let newLeader;
    return RedisClient.getGroupDetails(groupId).then((details) => {
        if(details.members.length > 0) {
            newLeader = details.members[0];
            return _setNewGroupLeader(groupId, namespace, details.members[0]).then((newLeaderDetails) => {
                namespace.to(getGroupRoom(groupId)).emit(clientEvents.groupHeroLeft, newLeaderDetails);
                return _removeHeroFromMembers(groupId, namespace, newLeader);
            });
        } else {
            throw new SocketError(exceptions.noMemberHerosToPromote, 'groupId', groupId);
        }
    });
};

/**
 * Removes a hero from the members array, also fires the hero removed event
 * @param groupId
 * @param namespace
 * @param hero
 * @returns {Promise}
 * @private
 */
let _removeHeroFromMembers = function(groupId, namespace, hero) {
    return RedisClient.removeHeroFromGroupMembers(groupId, hero).then(() => {
        return RedisClient.getGroupDetails(groupId);
    }).then((details) => {
        namespace.to(getGroupRoom(groupId)).emit(clientEvents.groupHeroLeft, details);
    });
};

/**
 * This function deletes the group and can only be done if there are no members or pending members.
 * Fires the heroRemoved event for the leader that will be removed
 * @param groupId
 * @param namespace
 * @private
 */
let _deleteGroup = function(groupId, namespace) {
    return RedisClient.getGroupDetails(groupId).then((details) => {
        if (details.members.length === 0
        && details.pending.length === 0) {
            return RedisClient.deleteGroup(groupId);
        } else {
            throw exceptions.groupNotEmpty;
        }
    }).then(() => {
        return RedisClient.getGroupDetails(groupId);
    }).then((details) => {
        namespace.to(getGroupRoom(groupId)).emit(clientEvents.groupHeroLeft, details);
    });
};

/**
 * Adds the socket to the group room
 * @param groupId
 * @param socket
 */
let addSocketToGroupRoom = function (groupId, socket) {
    socket.join(getGroupRoom(groupId));
};

/**
 * Adds the socket to the (private) player room
 * @param battleNetId
 * @param socket
 */
let addSocketToPlayerRoom = function (battleNetId, socket) {
    socket.join(getPlayerRoom(battleNetId));
};

let getHeroFromListById = function(list, id) {
    return list.find((element) => {
        return element.battleNetId === id;
    });
};

let getGroupMemberHeroById = function(battleNetId, groupId) {
    return RedisClient.getGroupDetails(groupId).then((details) => {
        return getHeroFromListById(details.members, battleNetId);
    });
};

let getPlayerRoom = function(battleNetId) {
    return `player.${battleNetId}`;
};

let getGroupRoom = function(groupId) {
    return `group.${groupId}`;
};

module.exports = {
    addSocketToPlayerRoom,
    addSocketToGroupRoom,
    createNewGroup,
    invitePlayerToGroup,
    acceptGroupInvite,
    getGroupMemberHeroById,
    removePlayerFromGroup,
    removePlayerFromGroupPending
};