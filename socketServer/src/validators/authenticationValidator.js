const logger = require('../services/logger').sysLogger;
const SocketError = require('./exceptions/SocketError');
const exceptions = require('./exceptions/exceptions');
const stringValidator = require('./stringValidators').runAllValidators;

let validateToken = function(token) {
    if(stringValidator(token)) {
        return true;
    }

    logger.error(`Recieved malformed token for authentication: ${token}`);
    throw new SocketError(exceptions.malformedToken, 'token', token);
};

module.exports = {
    validateToken
};