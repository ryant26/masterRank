const BaseController = require('./BaseController');
const serverEvents = require('../../../shared/libs/socketEvents/serverEvents');
const clientEvents = require('../../../shared/libs/socketEvents/clientEvents');
const authenticationService = require('../services/authenticationService');

/**
 * This class handles validating tokens against the auth server
 * @param config.authenticatedCallback - Callback to be called upon successful authentication
 * @param {} config.socket - socket
 * @constructor
 */
module.exports = class AuthenticationController extends BaseController {
    constructor (config) {
        super(config);

        this.on(serverEvents.authenticate, (data) => {
            return authenticationService.authenticate(data.eventData, this.socket).then((token) => {
                this.token = token;
            });
        });

        this.after(serverEvents.authenticate, () => {
            this.socket.emit(clientEvents.authenticated);
            config.authenticatedCallback(this.token);
        });
    }
};
