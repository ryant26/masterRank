const logger = require('winston');
const runUtils = require('./src/runningUtilities');

// Directories
const heroApiRoot = __dirname + '/../heroApiServer';
const socketServerRoot = __dirname + '/../socketServer';
const landingPageRoot = __dirname + '/../landingPage';

// Start Dependencies
runUtils.checkExist('mongod');
runUtils.checkExist('redis-server');

runUtils.startProcess('mongod', 'port 27017').then(() => {
    return runUtils.startProcess('redis-server', 'port 6379');
}).then(() => {
    let proxy = runUtils.startNodeProcess(heroApiRoot, 'devTools/proxy.js', 'develop');
    let heroApiServer = runUtils.startNodeProcess(heroApiRoot, 'src/app.js', 'develop', 'port 3001');
    let socketServer = runUtils.startNodeProcess(socketServerRoot, 'src/app.js', 'develop', 'port 3002');
    let landingPage = runUtils.startNodeProcess(landingPageRoot, 'fileserver.js', 'develop', 'port 3003');

    return Promise.all([proxy, heroApiServer, socketServer, landingPage]);
}).then(() => {
    logger.info('====================== All Processes Started ====================');
    logger.info('=================================================================');
    logger.info('Https Proxy -> Port 3000');
    logger.info('Hero API Server -> Port 3001');
    logger.info('Socket Server -> Port 3002');
    logger.info('Landing Page -> Port 3003');
    logger.info('=================================================================');
    logger.info('=================================================================');
}).catch(err => {
    logger.error('There was a problem starting something...');
    if (err) logger.error(err);
    runUtils.killAllNodeProcesses().then(() => {
        process.exit(1);
    });
});