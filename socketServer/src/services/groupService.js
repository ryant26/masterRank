const logger = require('./logger').sysLogger;
const clientEvents = require('../socketEvents/clientEvents');
const PlayerClient = require('../apiClients/PlayerClient');
const RedisClient = require('../apiClients/RedisClient');
const exceptions = require('../validators/exceptions/exceptions');
const SocketError = require('../validators/exceptions/SocketError');

/**
 * This function creates a new group
 * Fires Events: groupPromotedLeader
 * @param token
 * @param socket
 * @param namespace
 * @param hero
 * @returns {Promise.<>}
 */
let createNewGroup = function (token, socket, namespace, hero) {
    let groupId;

    return RedisClient.createNewGroup().then((id) => {
        groupId = id;
        addSocketToGroupRoom(groupId, socket);
        logger.info(`${token.platformDisplayName} created new group ${id}`);
        return PlayerClient.getHeroStats(token.platformDisplayName, token.region, token.platform, hero.heroName);
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
 * @param token
 */
let getGroupId = function(token) {
    return RedisClient.getGroupId(token.platformDisplayName, token.platform);
};

/**
 * This functions sets the stored groupId for the passed player
 * @param token
 * @param groupId
 */
let setGroupId = function(token, groupId) {
    return RedisClient.setGroupId(token.platformDisplayName, token.platform, groupId);
};

/**
 * This function deletes the stored groupId for the passed player
 * @param token
 */
let deleteGroupId = function(token) {
    return RedisClient.deleteGroupId(token.platformDisplayName, token.platform);
};

/**
 * This function invites the passed hero to the group.
 * Fires Events: groupInviteReceived, playerInvited
 * @param token
 * @param groupId
 * @param socket
 * @param namespace
 * @param hero
 * @returns {Promise}
 */
let invitePlayerToGroup = function(token, groupId, socket, namespace, hero) {
    return RedisClient.getPlayerHeros(hero.platformDisplayName, token.platform).then((heros) => {
        logger.info(`Invited hero ${hero.platformDisplayName}:${hero.heroName} to group ${groupId}`);

        let heroStats = heros.find((element) => {
            return element.heroName === hero.heroName;
        });

        return RedisClient.addHeroToGroupPending(groupId, heroStats);
    }).then(() => {
        return RedisClient.getGroupDetails(groupId);
    }).then((groupDetails) => {
        socket.to(getPlayerRoom({platformDisplayName: hero.platformDisplayName, platform: token.platform}))
            .emit(clientEvents.groupInviteReceived, groupDetails);
        namespace.to(getGroupRoom(groupId)).emit(clientEvents.playerInvited, groupDetails);
    }).catch((err) => {
        logger.error(`Problem inviting ${hero.platformDisplayName}:${hero.heroName} to group ${groupId}: ${err}`);
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
let cancelInviteToGroup = function(groupLeaderToken, groupId, socket, namespace, hero) {
    return RedisClient.getGroupDetails(groupId).then((details) => {
        logger.info(`Canceling hero ${hero.platformDisplayName}'s invite to group ${groupId}`);

        let heroStats = details.pending.find((element) => {
            return element.platformDisplayName === hero.platformDisplayName;
        });

        return RedisClient.removeHeroFromGroupPending(groupId, heroStats);
    }).then(() => {
        return RedisClient.getGroupDetails(groupId);
    }).then((details) => {
        socket.to(getPlayerRoom({platformDisplayName: hero.platformDisplayName, platform: groupLeaderToken.platform}))
            .emit(clientEvents.groupInviteCanceled, details);
        namespace.to(getGroupRoom(groupId)).emit(clientEvents.playerInviteCanceled, details);
    }).catch((err) => {
        logger.error(`Problem trying to cancel invite to ${hero.platformDisplayName} for group ${groupId}: ${err}`);
        throw err;
    });
};

/**
 * This function accepts a group invite
 * Fires Events: groupInviteAccepted
 * @param token
 * @param groupId
 * @param socket
 * @param namespace
 * @returns {Promise}
 */
let acceptGroupInvite = function (token, groupId, socket, namespace) {
    return _acceptGroupInviteWithRetry(token, groupId, 3).then(() => {
        addSocketToGroupRoom(groupId, socket);
        return RedisClient.getGroupDetails(groupId);
    }).then((details) => {
        namespace.to(getGroupRoom(groupId)).emit(clientEvents.groupInviteAccepted, details);
    }).catch((err) => {
        logger.error(`${token.platformDisplayName} encountered a problem accepting invite to ${groupId}: ${err}`);
        throw err;
    });
};

/**
 * Removes the player with the passed ID from the group (including leaders)
 * @param token
 * @param groupId
 * @param socket
 * @param namespace
 * @returns {Promise}
 */
let removePlayerFromGroup = function (token, groupId, socket, namespace) {
    return _removePlayerFromGroupWithRetry(token, groupId, socket, namespace, 5).then(() => {
        socket.leave(getGroupRoom(groupId));
    }).catch((err) => {
        logger.error(`Encountered a problem removing player [${token.platformDisplayName}] from group [${groupId}]: ${err}`);
        throw err;
    });
};

/**
 * This function removes a hero from the group pending list of the passed groupId.
 * Fires the events: groupInviteDeclined, error.groupInviteDecline
 * @param platformDisplayName
 * @param groupId
 * @param socket
 * @param namespace
 * @returns {Promise}
 */
let declineGroupInvite = function (token, groupId, socket, namespace) {
    return RedisClient.getGroupDetails(groupId).then((details) => {
        let hero = getHeroFromListById(details.pending, token.platformDisplayName);
        return RedisClient.removeHeroFromGroupPending(groupId, hero);
    }).then(() => {
        return RedisClient.getGroupDetails(groupId);
    }).then((details) => {
        namespace.to(getGroupRoom(groupId)).emit(clientEvents.groupInviteDeclined, details);
    }).catch((err) => {
        logger.error(`Encountered a problem removing player [${token.platformDisplayName}] from group [${groupId}]: ${err}`);
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
 * @param token
 * @param groupId
 * @param socket
 * @param namespace
 * @param retriesRemaining
 * @returns {Promise}
 * @private
 */
let _removePlayerFromGroupWithRetry = function (token, groupId, socket, namespace, retriesRemaining) {
    return new Promise((resolve, reject) => {
        RedisClient.getGroupDetails(groupId).then((groupDetails) => {
            if (groupDetails.leader.platformDisplayName === token.platformDisplayName) {
                if (groupDetails.members.length > 0) {
                    _replaceGroupLeaderWithMember(groupId, namespace).then(() => {
                        resolve();
                    }).catch((err) => {
                        if (retriesRemaining > 0) {
                            resolve(_removePlayerFromGroupWithRetry(token, groupId, socket, namespace, --retriesRemaining));
                        } else {
                            reject(err);
                        }
                    });
                } else {
                    resolve(_deleteGroup(groupId, namespace));
                }
            } else {
                let hero = getHeroFromListById(groupDetails.members, token.platformDisplayName);
                resolve(_removeHeroFromMembers(groupId, namespace, hero));
            }
        });
    });
};

/**
 * This function moves a hero from the pending list into the members list
 * and accepts a retry parameter.
 * @param token
 * @param groupId
 * @param retriesRemaining
 * @returns {Promise}
 * @private
 */
let _acceptGroupInviteWithRetry = function (token, groupId, retriesRemaining) {
    return new Promise((resolve, reject) => {
        RedisClient.getGroupDetails(groupId).then((details) => {
            let hero = getHeroFromListById(details.pending, token.platformDisplayName);
            if(!hero) reject(exceptions.heroNotInvitedToGroup);
            return  RedisClient.moveHeroFromPendingToMembers(groupId, hero);
        }).then(() => {
            resolve();
        }).catch((err) => {
            if(retriesRemaining > 0) {
                resolve(_acceptGroupInviteWithRetry(token, groupId, --retriesRemaining));
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
                    namespace.to(getPlayerRoom(pendingHero)).emit(clientEvents.groupInviteCanceled, details);
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
 * @param token
 * @param socket
 */
let addSocketToPlayerRoom = function (token, socket) {
    socket.join(getPlayerRoom(token));
};

let getHeroFromListById = function(list, id) {
    return list.find((element) => {
        return element.platformDisplayName === id;
    });
};

let getGroupMemberHeroById = function(token, groupId) {
    return RedisClient.getGroupDetails(groupId).then((details) => {
        return getHeroFromListById(details.members, token.platformDisplayName);
    });
};

let getPlayerRoom = function(token) {
    return `player.${token.platformDisplayName}.${token.platform}`;
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