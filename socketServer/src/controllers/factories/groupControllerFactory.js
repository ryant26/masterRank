const groupValidators = require('../../validators/groupValidators');
const playerValidators = require('../../validators/playerValidators');
const serverEvents = require('../../socketEvents/serverEvents');
const GroupController = require('../GroupController');
const RedisClient = require('../../apiClients/RedisClient');
const exceptions = require('../../validators/exceptions/exceptions');
const SocketError = require('../../validators/exceptions/SocketError');

/**
 * This function returns a constructed GroupController with access controls and other setup completed
 * @param config - config object that GroupController constructor expects
 * @returns {GroupController}
 */
let getGroupController = function(config) {
    let groupController = new GroupController(config);
    configureValidHeroObjectInput(groupController);
    configureValidGroupIdInput(groupController);
    configureLeaderValidation(groupController);
    configureHeroExistsValidation(groupController);
    configrePlayersHeroInGroupPending(groupController);
    configurePassedHeroInGroupPending(groupController);
    configureHeroInGroup(groupController);
    return groupController;
};

/**
 * This function configures the "is leader" validator for all socket
 * events that the sender must be a group leader to use
 * @param groupController - the controller accepting events
 */
let configureLeaderValidation = function(groupController) {
    groupController.before([serverEvents.groupInviteSend, serverEvents.groupInviteCancel], () => {
        return RedisClient.getGroupDetails(groupController.groupId).then((groupDetails) => {
            groupValidators.idIsLeader(groupDetails, groupController.token.platformDisplayName);
        });
    });
};

/**
 * This function configures the "hero exists" validator for all socket events
 * that the hero must exist in the player's hero pool
 * @param groupController
 */
let configureHeroExistsValidation = function(groupController) {
    groupController.before(serverEvents.groupInviteSend, (data) => {
        return RedisClient.getPlayerHeros(data.eventData.platformDisplayName, groupController.token.platform).then((heros) => {
            playerValidators.heroExists(heros, data.eventData);
        }).catch((error) => {
            throw new SocketError(error, 'hero', data.eventData);
        });
    });
};

/**
 * This function configures the "id in pending" validator for all socket events
 * that the "emitting" player's hero must exist in the group's "pending members" array (player was invited)
 * @param groupController
 */
let configrePlayersHeroInGroupPending = function(groupController) {
    groupController.before([serverEvents.groupInviteAccept, serverEvents.groupInviteDecline], (data) => {
        return RedisClient.getGroupDetails(data.eventData).then((groupDetails) => {
            groupValidators.idInPending(groupDetails, groupController.token.platformDisplayName);
        });
    });
};

let configurePassedHeroInGroupPending = function(groupController) {
    groupController.before(serverEvents.groupInviteCancel, (data) => {
        return RedisClient.getGroupDetails(groupController.groupId).then((groupDetails) => {
            groupValidators.idInPending(groupDetails, data.eventData.platformDisplayName);
        });
    });
};

/**
 * This function configures the "user in group" validator for all socket events
 * that the passed hero must exist as a member or leader in the group.
 * @param groupController
 */
let configureHeroInGroup = function(groupController) {
    groupController.before(serverEvents.groupLeave, () => {
        return new Promise((resolve) => {
            if (!groupController.groupId) throw new SocketError(exceptions.userNotInGroup);
            resolve(RedisClient.getGroupDetails(groupController.groupId).then((groupDetails) => {
                groupValidators.idIsLeaderOrMember(groupDetails, groupController.token.platformDisplayName);
            }));
        });
    });
};

/**
 * This function configures the "valid hero object" validator for all socket events that accept
 * a hero object as input
 * @param groupController
 */
let configureValidHeroObjectInput = function(groupController) {
    groupController.before([serverEvents.groupInviteCancel, serverEvents.groupInviteSend], (data) => {
        return new Promise((resolve) => {
            resolve(playerValidators.validHeroObject(data.eventData));
        }).catch((error) => {
            throw new SocketError(error, 'hero', data.eventData);
        });
    });
};

/**
 * This function configues the "valid group ID" validator for all socket events that accept a group ID as input
 * @param groupController
 */
let configureValidGroupIdInput = function(groupController) {
    groupController.before([serverEvents.groupInviteAccept, serverEvents.groupInviteDecline], (data) => {
        return new Promise((resolve) => {
            resolve(groupValidators.groupIdIsValid(data.eventData));
        });
    });
};

module.exports = {
    getGroupController
};