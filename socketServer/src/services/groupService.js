const logger = require('winston');
const clientEvents = require('../socketEvents/clientEvents');
const PlayerClient = require('../apiClients/PlayerClient');
const RedisClient = require('../apiClients/RedisClient');
const exceptions = require('../validators/exceptions/exceptions');
const SocketError = require('../validators/exceptions/SocketError');

/**
 * This function creates a new group
 * Fires Events: groupPromotedLeader
 * @param battleNetId
 * @param region
 * @param socket
 * @param namespace
 * @param hero
 * @returns {Promise.<TResult>}
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
 * This function gets the stored groupId for the passed player
 * @param battleNetId
 */
let getGroupId = function(battleNetId, platform) {
    return RedisClient.getGroupId(battleNetId, platform);
};

/**
 * This functions sets the stored groupId for the passed player
 * @param battleNetId
 * @param groupId
 */
let setGroupId = function(battleNetId, platform, groupId) {
    return RedisClient.setGroupId(battleNetId, platform, groupId);
};

/**
 * This function deletes the stored groupId for the passed player
 * @param battleNetId
 */
let deleteGroupId = function(battleNetId, platform) {
    return RedisClient.deleteGroupId(battleNetId, platform);
};

/**
 * This function invites the passed hero to the group.
 * Fires Events: groupInviteReceived, playerInvited
 * @param battleNetId
 * @param groupId
 * @param socket
 * @param namespace
 * @param hero
 * @returns {Promise}
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
 * Cancel an invite to the passed hero for the passed group
 * Fires events: groupInviteCanceled
 * @param groupId
 * @param socket
 * @param namespace
 * @param hero
 * @returns {Promise}
 */
let cancelInviteToGroup = function(groupId, socket, namespace, hero) {
    return RedisClient.getGroupDetails(groupId).then((details) => {
        logger.info(`Canceling hero ${hero.battleNetId}'s invite to group ${groupId}`);

        let heroStats = details.pending.find((element) => {
            return element.battleNetId === hero.battleNetId;
        });

        return RedisClient.removeHeroFromGroupPending(groupId, heroStats);
    }).then(() => {
        return RedisClient.getGroupDetails(groupId);
    }).then((details) => {
        socket.to(getPlayerRoom(hero.battleNetId)).emit(clientEvents.groupInviteCanceled, details);
        namespace.to(getGroupRoom(groupId)).emit(clientEvents.groupInviteCanceled, details);
    }).catch((err) => {
        logger.error(`Problem trying to cancel invite to ${hero.battleNetId} for group ${groupId}: ${err}`);
        throw err;
    });
};

/**
 * This function accepts a group invite
 * Fires Events: groupInviteAccepted
 * @param battleNetId
 * @param groupId
 * @param socket
 * @param namespace
 * @returns {Promise}
 */
let acceptGroupInvite = function (battleNetId, groupId, socket, namespace) {
    return _acceptGroupInviteWithRetry(battleNetId, groupId, 3).then(() => {
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
    return _removePlayerFromGroupWithRetry(battleNetId, groupId, socket, namespace, 5).then(() => {
        socket.leave(getGroupRoom(groupId));
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
let declineGroupInvite = function (battleNetId, groupId, socket, namespace) {
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
 * Fires Events: groupHeroPromoted
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
 * This function removes a hero from the group and accepts a retry parameter. This function is necessary
 * because of the race condition in _replaceGroupLeaderWithMember.
 * @param battleNetId
 * @param groupId
 * @param socket
 * @param namespace
 * @param retriesRemaining
 * @returns {Promise}
 * @private
 */
let _removePlayerFromGroupWithRetry = function (battleNetId, groupId, socket, namespace, retriesRemaining) {
    return new Promise((resolve, reject) => {
        RedisClient.getGroupDetails(groupId).then((groupDetails) => {
            if (groupDetails.leader.battleNetId === battleNetId) {
                if (groupDetails.members.length > 0) {
                    _replaceGroupLeaderWithMember(groupId, namespace).then(() => {
                        resolve();
                    }).catch((err) => {
                        if (retriesRemaining > 0) {
                            resolve(_removePlayerFromGroupWithRetry(battleNetId, groupId, socket, namespace, --retriesRemaining));
                        } else {
                            reject(err);
                        }
                    });
                } else {
                    resolve(_deleteGroup(groupId, namespace));
                }
            } else {
                let hero = getHeroFromListById(groupDetails.members, battleNetId);
                resolve(_removeHeroFromMembers(groupId, namespace, hero));
            }
        });
    });
};

/**
 * This function moves a hero from the pending list into the members list
 * and accepts a retry parameter.
 * @param battleNetId
 * @param groupId
 * @param retriesRemaining
 * @returns {Promise}
 * @private
 */
let _acceptGroupInviteWithRetry = function (battleNetId, groupId, retriesRemaining) {
    return new Promise((resolve, reject) => {
        RedisClient.getGroupDetails(groupId).then((details) => {
            let hero = getHeroFromListById(details.pending, battleNetId);
            if(!hero) reject(exceptions.heroNotInvitedToGroup);
            return  RedisClient.moveHeroFromPendingToMembers(groupId, hero);
        }).then(() => {
            resolve();
        }).catch((err) => {
            if(retriesRemaining > 0) {
                resolve(_acceptGroupInviteWithRetry(battleNetId, groupId, --retriesRemaining));
            } else {
                reject(err);
            }
        });
    });
};

/**
 * This function removes the current group leader, will reject on race condition (group members altered)
 * Fires Events: groupHeroPromoted, groupHeroLEft
 * @param groupId
 * @param namespace
 * @returns {Promise}
 * @private
 */
let _replaceGroupLeaderWithMember = function(groupId, namespace) {
    return RedisClient.getGroupDetails(groupId).then((detailsOld) => {
        if(detailsOld.members.length > 0) {
            return RedisClient.replaceGroupLeaderWithMember(groupId);
        } else {
            throw new SocketError(exceptions.noMemberHerosToPromote, 'groupId', groupId);
        }
    }).then(() => {
        return RedisClient.getGroupDetails(groupId);
    }).then((details) => {
        namespace.to(getGroupRoom(groupId)).emit(clientEvents.groupHeroLeft, details);
        namespace.to(getGroupRoom(groupId)).emit(clientEvents.groupPromotedLeader, details);
    });
};

/**
 * Removes a hero from the members array, also fires the hero removed event
 * Fires Events: groupHeroLeft
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
 * This function deletes the group and can only be done if there are no members.
 * Fires Events: groupHeroLeft
 * @param groupId
 * @param namespace
 * @private
 */
let _deleteGroup = function(groupId, namespace) {
    return RedisClient.getGroupDetails(groupId).then((details) => {
        if (details.members.length === 0) {
            return RedisClient.deleteGroup(groupId).then(() => {
                details.pending.forEach((pendingHero) => {
                    namespace.to(getPlayerRoom(pendingHero.battleNetId)).emit(clientEvents.groupInviteCanceled, details);
                });
            });
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
    getGroupId,
    setGroupId,
    deleteGroupId,
    invitePlayerToGroup,
    acceptGroupInvite,
    getGroupMemberHeroById,
    removePlayerFromGroup,
    declineGroupInvite,
    cancelInviteToGroup
};