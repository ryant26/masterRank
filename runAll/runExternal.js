const logger = require('winston');
const runUtils = require('./src/runningUtilities');

// Start Dependencies
runUtils.checkExist('mongod');
runUtils.checkExist('redis-server');

runUtils.startProcess('mongod', 'port 27017').then(() => {
    return runUtils.startProcess('redis-server', 'port 6379');
}).then(() => {
    logger.info('====================== All Processes Started ====================');
    logger.info('=================================================================');
    logger.info('Redis');
    logger.info('Mongo DB');
    logger.info('=================================================================');
    logger.info('=================================================================');
}).catch(err => {
    logger.error('There was a problem starting something...');
    if (err) logger.error(err);
    process.exit(1);
});