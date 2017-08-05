let BaseController = require('./BaseController');
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
module.exports = class GroupController extends BaseController {

    constructor (config) {
        super(config);

        GroupService.addSocketToPlayerRoom(this.battleNetId, this.socket);

        this.on(serverEvents.groupInviteSend, (data) => {
            GroupService.invitePlayerToGroup(this.battleNetId, this.groupId, this.socket, this.namespace, data.eventData);
        });

        this.on(serverEvents.createGroup, (data) => {
            GroupService.createNewGroup(this.battleNetId, this.region, this.socket, data.eventData).then((id) => {
                this.groupId = id;
            });
        });

        this.on(serverEvents.groupInviteAccept, (data) => {
            GroupService.acceptGroupInvite(this.battleNetId, data.eventData, this.socket, this.namespace).then(() => {
                this.groupId = data.eventData;
            });
        });
    }
};
