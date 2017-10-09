const playerValidators = require('../../validators/playerValidators');
const serverEvents = require('../../socketEvents/serverEvents');
const PlayerController = require('../PlayerController');

/**
 * This function returns a constructed GroupController with access controls and other setup completed
 * @param config - config object that GroupController constructor expects
 * @returns {GroupController}
 */
let getPlayerController = function(config) {
    let playerController = new PlayerController(config);
    configureValidateHeroNameInput(playerController);
    return playerController;
};

let configureValidateHeroNameInput = function(playerController) {
    playerController.before([serverEvents.addHero, serverEvents.removeHero], (data) => {
        return new Promise((resolve) => {
            resolve(playerValidators.validateHeroName(data.eventData));
        });
    });
};

module.exports = {
    getPlayerController
};