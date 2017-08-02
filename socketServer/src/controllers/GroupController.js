let logger = require('winston');
let clientEvents = require('../socketEvents/clientEvents');
let serverEvents = require('../socketEvents/serverEvents');
let groupValidators = require('../validators/groupValidators');
let playerValidators = require('../validators/playerValidators');
let PlayerClient = require('../apiClients/PlayerClient');
let RedisClient = require('../apiClients/RedisClient');

/**
 * This object handles websocket events for grouping activities
 * @param config.socket - Websocket
 * @param config.socket.token - Access token
 * @param config.RedisClient - RedisClient
 * @param config.PlayerClient - PlayerClient
 * @param config.region - region
 * @constructor
 */
let GroupController = function (config) {
    let socket = config.socket;
    let token = socket.token;
    let battleNetId = token.battleNetId;
    let region = config.region;
    let namespace = config.namespace;
    let groupId;

    let getPlayerRoom = function(battleNetId) {
        return `player.${battleNetId}`;
    };

    let getGroupRoom = function() {
        return `group.${groupId}`;
    };

    /**
     * Creates a new group with a group leader (hero)
     */
    let createNewGroup = function (hero) {
        return RedisClient.createNewGroup().then((id) => {
            addSelfToGroup(id);
            logger.info(`${battleNetId} created new group ${id}`);
            return PlayerClient.getHeroStats(battleNetId, region, hero.heroName);
        }).then((heroStats) => {
            return RedisClient.setGroupLeader(groupId, heroStats);
        }).catch((err) => {
            logger.error(`Problem creating group: ${err}`);
        });
    };

    /**
     * Invite hero to group
     * @param player.battleNetId
     */
    let invitePlayerToGroup = function(hero) {
        let getPlayerHeros = RedisClient.getPlayerHeros(hero.battleNetId);
        let getGroupDetails = RedisClient.getGroupDetails(groupId);
        Promise.all([getPlayerHeros, getGroupDetails]).then((results) => {
            let heros = results[0];
            let groupDetails = results[1];

            groupValidators.idIsLeader(groupDetails, battleNetId);
            playerValidators.heroExists(heros, hero);

            logger.info(`Invited hero ${hero.battleNetId}:${hero.heroName} to group ${groupId}`);

            let heroStats = heros.find((element) => {
                return element.heroName === hero.heroName;
            });

            return RedisClient.addHeroToGroupPending(groupId, heroStats);
        }).then(() => {
            return RedisClient.getGroupDetails(groupId);
        }).then((groupDetails) => {
            socket.to(getPlayerRoom(hero.battleNetId)).emit(clientEvents.groupInviteReceived, groupDetails);
            namespace.to(getGroupRoom()).emit(clientEvents.playerInvited, groupDetails);
        }).catch((err) => {
            logger.error(`Problem inviting ${hero.battleNetId}:${hero.heroName} to group ${groupId}: ${err}`);
        });
    };

    let acceptGroupInvite = function (groupId) {
        RedisClient.getGroupDetails(groupId).then((details) => {
            groupValidators.idInPending(details, battleNetId);

            addSelfToGroup(groupId);
            let hero = getHeroFromListById(details.pending, battleNetId);
            return Promise.all([RedisClient.removeHeroFromGroupPending(groupId, hero), RedisClient.addHeroToGroupMembers(groupId, hero)]);
        }).then(() => {
            return RedisClient.getGroupDetails(groupId);
        }).then((details) => {
            namespace.to(getGroupRoom()).emit(clientEvents.groupInviteAccepted, details);
        }).catch((err) => {
            logger.error(`${battleNetId} encountered a problem accepting invite to ${groupId}: ${err}`);
        });
    };

    let addSelfToGroup = function(id) {
        groupId = id;
        socket.join(getGroupRoom());
    };

    let getHeroFromListById = function(list, id) {
        return list.find((element) => {
            return element.battleNetId === id;
        });
    };


    socket.join(getPlayerRoom(battleNetId));

    socket.on(serverEvents.groupInviteSend, invitePlayerToGroup);
    socket.on(serverEvents.createGroup, createNewGroup);
    socket.on(serverEvents.groupInviteAccept, acceptGroupInvite);
};

module.exports = GroupController;