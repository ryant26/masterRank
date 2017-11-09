const logger = require('../src/services/logger').sysLogger;

let tokenHelper = require('./tokenHelpers');

logger.info(tokenHelper.getValidToken('TestUser#1234', 'us', 'pc'));