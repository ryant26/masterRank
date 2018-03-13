const playerValidators = require('../../validators/playerValidators');
const serverEvents = require('../../socketEvents/serverEvents');
const PlayerController = require('../PlayerController');
const SocketError = require('../../validators/exceptions/SocketError');

/**
 * This function returns a constructed GroupController with access controls and other setup completed
 * @param config - config object that GroupController constructor expects
 * @returns {GroupController}
 */
let getPlayerController = function(config) {
    let playerController = new PlayerController(config);
    configureValidateHeroNameInput(playerController);
    configureValidatePriorityInput(playerController);
    return playerController;
};

let configureValidateHeroNameInput = function(playerController) {
    playerController.before([serverEvents.addHero, serverEvents.removeHero], (data) => {
        return new Promise((resolve) => {
            let heroName;
            if (data.eventData) {
                heroName = data.eventData.heroName || data.eventData;
            }
            resolve(playerValidators.validateHeroName(heroName));
        }).catch((error) => {
            throw new SocketError(error, 'hero', data.eventData);
        });
    });
};

let configureValidatePriorityInput = function(playerController) {
    playerController.before([serverEvents.addHero], (data) => {
        return new Promise((resolve) => {
            resolve(playerValidators.validatePriority(data.eventData.priority));
        }).catch((error) => {
            throw new SocketError(error, 'hero', data.eventData);
        });
    });
};

module.exports = {
    getPlayerController
};