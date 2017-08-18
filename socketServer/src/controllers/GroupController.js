const BaseController = require('./BaseController');
const serverEvents = require('../socketEvents/serverEvents');
const groupService = require('../services/groupService');
const playerService = require('../services/playerService');

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

        groupService.addSocketToPlayerRoom(this.battleNetId, this.socket);

        this.on(serverEvents.groupInviteSend, (data) => {
            return groupService.invitePlayerToGroup(this.battleNetId, this.groupId, this.socket, this.namespace, data.eventData);

        });

        this.on(serverEvents.createGroup, (data) => {
            return groupService.createNewGroup(this.battleNetId, this.region, this.socket, this.namespace, data.eventData).then((id) => {
                this.groupId = id;
            });
        });

        this.on(serverEvents.groupInviteAccept, (data) => {
            return groupService.acceptGroupInvite(this.battleNetId, data.eventData, this.socket, this.namespace).then(() => {
                this.groupId = data.eventData;
                return Promise.all([groupService.getGroupMemberHeroById(this.battleNetId, data.eventData),
                    playerService.getPlayerRank(this.battleNetId, this.region)]);
            }).then((results) => {
                let hero = results[0];
                let rank = results[1].rank;
                return playerService.removePlayerHeros(this.battleNetId, rank, this.region, this.namespace, hero);
            });
        });

        this.on(serverEvents.groupInviteDecline, (data) => {
            return groupService.declineGroupInvite(this.battleNetId, data.eventData, this.socket, this.namespace);
        });

        this.on(serverEvents.groupInviteCancel, (data) => {
            return groupService.cancelInviteToGroup(this.groupId, this.socket, this.namespace, data.eventData);
        });

        this.on(serverEvents.groupLeave, () => {
            return groupService.removePlayerFromGroup(this.battleNetId, this.groupId, this.socket, this.namespace);
        });

        this.on(serverEvents.disconnect, () => {
            if (this.groupId) {
                return groupService.removePlayerFromGroup(this.battleNetId, this.groupId, this.socket, this.namespace);
            }
        });
    }
};
