/**
 * This function handles validating tokens against the auth server
 * @param config.authenticatedCallback - Callback to be called upon successful authentication
 * @param {} config.socket - socket
 * @constructor
 */
let AuthenticationController = function (config) {
    config.socket.on('authenticate', (token) => {
        //TODO Authenticate token here
        config.socket.token = token;
        config.socket.emit('authenticated');
        config.authenticatedCallback(config.socket);
    });
};

module.exports = AuthenticationController;