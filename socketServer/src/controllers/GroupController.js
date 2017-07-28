let logger = require('winston');
let clientEvents = require('../socketEvents/clientEvents');
let serverEvents = require('../socketEvents/serverEvents');

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
    let RedisClient = config.RedisClient;
    let PlayerClient = config.PlayerClient;
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
            groupId = id;
            socket.join(getGroupRoom());
            logger.info(`${battleNetId} created new group ${groupId}`);
            return PlayerClient.getHeroStats(battleNetId, region, hero.heroName);
        }).then((heroStats) => {
            return RedisClient.setGroupLeader(groupId, heroStats);
        });
    };

    /**
     * Invite hero to group
     * @param player.battleNetId
     */
    let invitePlayerToGroup = function(hero) {
        RedisClient.getPlayerHeros(hero.battleNetId).then((heros) => {
            logger.info(`Invited hero ${hero.battleNetId}:${hero.heroName} to group ${groupId}`);

            if(heros.indexOf(hero.heroName) > -1) {
                return PlayerClient.getHeroStats(hero.battleNetId, region, hero.heroName);
            } else {
                logger.error(`Tried to invite nonexistant hero ${hero.battleNetId}:${hero.heroName} to group ${groupId}`);
                throw 'Invited hero not found';
            }
        }).then((heroStats) => {
            return RedisClient.addHeroToGroupPending(groupId, heroStats);
        }).then(() => {
            return RedisClient.getGroupDetails(groupId);
        }).then((groupDetails) => {
            socket.to(getPlayerRoom(hero.battleNetId)).emit(clientEvents.groupInviteReceived, groupDetails);
            namespace.to(getGroupRoom()).emit(clientEvents.playerInvited, groupDetails);
        });
    };

    socket.join(getPlayerRoom(battleNetId));

    socket.on(serverEvents.groupInviteSend, invitePlayerToGroup);
    socket.on(serverEvents.createGroup, createNewGroup);
};

module.exports = GroupController;