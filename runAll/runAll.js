const shell = require('shelljs');
const logger = require('winston');
const spawn = require('child_process').spawn;

// Directories
const heroApiRoot = __dirname + '/../heroApiServer';
const socketServerRoot = __dirname + '/../socketServer';
const landingPageRoot = __dirname + '/../landingPage';

let processes = [];


let checkExist = function(command) {
    if (!shell.which(command)) {
        logger.error(`Needs ${command} to exist`);
        shell.exit(1);
    }
};

let startProcess = function(command, startString) {
    let process = shell.exec(command, {async: true});
    return new Promise((resolve, reject) => {
        process.stdout.on('data', (data) => {
            logger.info(data);
            if (startString) {
                let stringForm = data.toString();
                if (stringForm.includes(startString)) {
                    resolve(process);
                }
            } else {
                resolve(process);
            }
        });

        process.stderr.on('data', (data) => {
            logger.error(`${data}`);
            if (!data.toString().includes('DeprecationWarning')) {
                reject();
            }
        });
    });
};

let startNodeProcess = function(cwd, filePath, env, startupString) {
    return new Promise((resolve, reject) => {
        let child = spawn('node', [filePath], {cwd, env: Object.assign({}, process.env, {NODE_ENV: env})});
        processes.push(child);

        child.stdout.on('data', (data) => {
            logger.info(`${data}`);
            if (startupString) {
                let stringForm = data.toString();
                if (stringForm.includes(startupString)) {
                    resolve(child);
                }
            }
        });

        child.on('error', (err) => {
            logger.error(err);
            child.kill('SIGKILL');
        });


        child.stderr.on('data', (data) => {
            logger.error(`${data}`);
            if (!data.toString().includes('DeprecationWarning')) {
                reject();
            }
        });

        if(!startupString) {
            resolve(child);
        }
    });
};

let killAllNodeProcesses = function() {
    let out = [];

    processes.forEach((proc) => {
        out.push(new Promise((resolve) => {
            proc.on('close', () => {
                resolve();
            });

            proc.kill('SIGKILL');
        }));
    });

    return Promise.all(out);
};

// Start Dependencies
checkExist('mongod');
checkExist('redis-server');

startProcess('mongod', 'port 27017').then(() => {
    return startProcess('redis-server', 'port 6379');
}).then(() => {
    let proxy = startNodeProcess(heroApiRoot, 'devTools/proxy.js', 'develop');
    let heroApiServer = startNodeProcess(heroApiRoot, 'src/app.js', 'develop', 'port 3001');
    let socketServer = startNodeProcess(socketServerRoot, 'src/app.js', 'develop', 'port 3002');
    let landingPage = startNodeProcess(landingPageRoot, 'fileserver.js', 'develop', 'port 3003');

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
    killAllNodeProcesses().then(() => {
        process.exit(1);
    });
});