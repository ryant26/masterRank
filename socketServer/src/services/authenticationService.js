const authenticationApi = require('../apiClients/authenticationClient');
const logger = require('./logger').sysLogger;
const SocketError = require('../validators/exceptions/SocketError');
const exceptions = require('../validators/exceptions/exceptions');

let authenticate = function(tokenString) {
    return authenticationApi.authenticate(tokenString).catch((err) => {
        logger.error(`Passed token was invalid: ${err}`);
        throw new SocketError(exceptions.unauthorized, 'token', tokenString);
    });
};

module.exports = {
    authenticate
};