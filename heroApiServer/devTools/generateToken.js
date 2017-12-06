const logger = require('../src/services/logger').sysLogger;

let tokenHelper = require('./tokenHelpers');

logger.info(tokenHelper.getValidToken('Daco#11404', 'us', 'pc'));