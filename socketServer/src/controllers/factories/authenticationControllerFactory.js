const authenticationValidator = require('../../validators/authenticationValidator');
const serverEvents = require('../../socketEvents/serverEvents');
const AuthenticationController = require('../AuthenticationController');

/**
 * This function returns a constructed GroupController with access controls and other setup completed
 * @param config - config object that GroupController constructor expects
 * @returns {GroupController}
 */
let getAuthenticationController = function(config) {
    let authenticationController = new AuthenticationController(config);
    configureValidateToken(authenticationController);
    return authenticationController;
};

let configureValidateToken = function(authenticationController) {
    authenticationController.before([serverEvents.authenticate], (data) => {
        return new Promise((resolve) => {
            resolve(authenticationValidator.validateToken(data.eventData));
        });
    });
};

module.exports = {
    getAuthenticationController
};
