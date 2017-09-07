const BaseController = require('./BaseController');

/**
 * This class handles validating tokens against the auth server
 * @param config.authenticatedCallback - Callback to be called upon successful authentication
 * @param {} config.socket - socket
 * @constructor
 */
module.exports = class AuthenticationController extends BaseController {
    constructor (config) {
        super(config);

        this.on('authenticate', (data) => {
            // TODO Authenticate token here!!
            this.token = data.eventData;
        });

        this.after('authenticate', () => {
            this.socket.emit('authenticated');
            config.authenticatedCallback(this.token);
        });
    }
};
