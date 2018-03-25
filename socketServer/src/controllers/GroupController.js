const BaseController = require('./BaseController');
const serverEvents = require('../../../shared/libs/socketEvents/serverEvents');
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

    set groupId(id) {
        if (id) {
            groupService.setGroupId(this.token, id);
        } else {
            groupService.deleteGroupId(this.token);
        }
        this._groupId = id;
    }

    get groupId() {
        return this._groupId;
    }

    constructor (config) {
        super(config);

        groupService.addSocketToPlayerRoom(this.token, this.socket);

        groupService.getGroupId(this.token).then((id) => {
            if(id) this._groupId = id;
        });

        this.on(serverEvents.groupInviteSend, (data) => {
            return groupService.invitePlayerToGroup(this.token, this.groupId, this.socket, this.namespace, data.eventData);

        });

        this.on(serverEvents.groupInviteCancel, (data) => {
            return groupService.cancelInviteToGroup(this.token, this.groupId, this.socket, this.namespace, data.eventData);
        });

        this.on(serverEvents.createGroup, (data) => {
            return groupService.createNewGroup(this.token, this.socket, this.namespace, data.eventData).then((id) => {
                this.groupId = id;
            });
        });

        this.on(serverEvents.groupInviteAccept, (data) => {
            return groupService.acceptGroupInvite(this.token, data.eventData, this.socket, this.namespace).then(() => {
                this.groupId = data.eventData;
                return Promise.all([groupService.getGroupMemberHeroById(this.token, data.eventData),
                    playerService.getPlayerRank(this.token, this.region)]);
            });
        });

        this.on(serverEvents.groupInviteDecline, (data) => {
            return groupService.declineGroupInvite(this.token, data.eventData, this.socket, this.namespace);
        });

        this.on(serverEvents.groupLeave, () => {
            return new Promise((resolve) => {
                resolve(groupService.removePlayerFromGroup(this.token, this.groupId, this.socket, this.namespace));
            }).then(() => {
                this.groupId = null;
            });
        });

        this.on(serverEvents.disconnect, () => {
            if (this.groupId) {
                return Promise.all([groupService.removePlayerFromGroup(this.token, this.groupId, this.socket, this.namespace),
                    groupService.deleteGroupId(this.token)]);
            }
        });
    }
};
