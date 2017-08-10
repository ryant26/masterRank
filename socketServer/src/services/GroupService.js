let logger = require('winston');
let clientEvents = require('../socketEvents/clientEvents');
let PlayerClient = require('../apiClients/PlayerClient');
let RedisClient = require('../apiClients/RedisClient');

/**
 * Creates a new group with a group leader (hero)
 */
let createNewGroup = function (battleNetId, region, socket, hero) {
    let groupId;

    return RedisClient.createNewGroup().then((id) => {
        groupId = id;
        addSocketToGroupRoom(groupId, socket);
        logger.info(`${battleNetId} created new group ${id}`);
        return PlayerClient.getHeroStats(battleNetId, region, hero.heroName);
    }).then((heroStats) => {
        return RedisClient.setGroupLeader(groupId, heroStats);
    }).then(() => {
        return groupId;
    }).catch((err) => {
        logger.error(`Problem creating group: ${err}`);
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
        socket.emit(clientEvents.error.groupInviteSend, {
            err: 'Internal Server Error',
            hero
        });
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
        // groupValidators.idInPending(details, battleNetId);

        let hero = getHeroFromListById(details.pending, battleNetId);
        return Promise.all([RedisClient.removeHeroFromGroupPending(groupId, hero), RedisClient.addHeroToGroupMembers(groupId, hero)]);
    }).then(() => {
        addSocketToGroupRoom(groupId, socket);
        return RedisClient.getGroupDetails(groupId);
    }).then((details) => {
        namespace.to(getGroupRoom(groupId)).emit(clientEvents.groupInviteAccepted, details);
    }).catch((err) => {
        logger.error(`${battleNetId} encountered a problem accepting invite to ${groupId}: ${err}`);
        socket.emit(clientEvents.error.groupInviteAccept, {
            err: 'Internal Server Error',
            groupId
        });
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
    acceptGroupInvite
};