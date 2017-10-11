const logger = require('winston');

let tokenHelper = require('./tokenHelpers');

logger.info(tokenHelper.getValidToken('TestUser#1234', 'us', 'pc'));