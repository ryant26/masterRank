const logger = require('winston');
const runUtils = require('./src/runningUtilities');

// Directories
const heroApiRoot = __dirname + '/../heroApiServer';
const socketServerRoot = __dirname + '/../socketServer';
const landingPageRoot = __dirname + '/../landingPage';

// Start Dependencies
runUtils.checkExist('mongod');
runUtils.checkExist('redis-server');

const mockDataFlag = process.argv.includes('--mock-data') ? '--mock-data' : undefined;

runUtils.startProcess('mongod', 'port 27017').then(() => {
    return runUtils.startProcess('redis-server', 'port 6379', 'Ready to accept connections');
}).then(() => {
    let heroApiServer = runUtils.startNodeProcess(heroApiRoot, 'src/app.js', 'develop', 'port 3003');
    let landingPage = runUtils.startNodeProcess(landingPageRoot, 'fileserver.js', 'develop', 'port 3005');

    return Promise.all([heroApiServer, landingPage]);
}).then(() => {
    return runUtils.startNodeProcess(socketServerRoot, 'src/app.js', 'develop', 'port 3004', mockDataFlag);
}).then(() => {
    logger.info('====================== All Processes Started ====================');
    logger.info('=================================================================');
    logger.info('Hero API Server -> Port 3003');
    logger.info('Socket Server -> Port 3004');
    logger.info('Landing Page -> Port 3005');
    logger.info('=================================================================');
    logger.info('=================================================================');
}).catch(err => {
    logger.error('There was a problem starting something...');
    if (err) logger.error(err);
    runUtils.killAllNodeProcesses().then(() => {
        process.exit(1);
    });
});