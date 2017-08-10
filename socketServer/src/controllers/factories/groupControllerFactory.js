const groupValidators = require('../../validators/groupValidators');
const playerValidators = require('../../validators/playerValidators');
const serverEvents = require('../../socketEvents/serverEvents');
const GroupController = require('../GroupController');
const RedisClient = require('../../apiClients/RedisClient');

/**
 * This function returns a constructed GroupController with access controls and other setup completed
 * @param config - config object that GroupController constructor expects
 * @returns {GroupController}
 */
let getGroupController = function(config) {
    let groupController = new GroupController(config);
    configureLeaderValidation(groupController);
    configureHeroExistsValidation(groupController);
    configreHeroInGroupPending(groupController);
    return groupController;
};

/**
 * This function configures the "is leader" validator for all socket
 * events that the sender must be a group leader to use
 * @param groupController - the controller accepting events
 */
let configureLeaderValidation = function(groupController) {
    groupController.before(serverEvents.groupInviteSend, () => {
        return RedisClient.getGroupDetails(groupController.groupId).then((groupDetails) => {
            groupValidators.idIsLeader(groupDetails, groupController.battleNetId);
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
        return RedisClient.getPlayerHeros(data.eventData.battleNetId).then((heros) => {
            playerValidators.heroExists(heros, data.eventData);
        });
    });
};

/**
 * This function configures the "id in pending" validator for all socket events
 * that the passed hero must exist in the group's "pending members" array (player was invited)
 * @param groupController
 */
let configreHeroInGroupPending = function(groupController) {
    groupController.before(serverEvents.groupInviteAccept, (data) => {
        return RedisClient.getGroupDetails(data.eventData).then((groupDetails) => {
            groupValidators.idInPending(groupDetails, groupController.battleNetId);
        });
    });
};

module.exports = {
    getGroupController
};