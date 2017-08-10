let serverEvents = require('../socketEvents/serverEvents');
let GroupService = require('../services/GroupService');

/**
 * This object handles websocket events for grouping activities
 * @param config.socket - Websocket
 * @param config.socket.token - Access token
 * @param config.RedisClient - RedisClient
 * @param config.PlayerClient - PlayerClient
 * @param config.region - region
 * @param config.namespace - socket namespace
 * @constructor
 */
let GroupController = function (config) {
    let socket = config.socket;
    let token = socket.token;
    let battleNetId = token.battleNetId;
    let region = config.region;
    let namespace = config.namespace;
    let groupId;


    GroupService.addSocketToPlayerRoom(battleNetId, socket);

    socket.on(serverEvents.groupInviteSend, (hero) => GroupService.invitePlayerToGroup(battleNetId, groupId, socket, namespace, hero));

    socket.on(serverEvents.createGroup, (hero) => {
        GroupService.createNewGroup(battleNetId, region, socket, hero).then((id) => {
            groupId = id;
        });
    });

    socket.on(serverEvents.groupInviteAccept, (id) => {
        GroupService.acceptGroupInvite(battleNetId, id, socket, namespace).then(() => {
            groupId = id;
        });
    });
};

module.exports = GroupController;