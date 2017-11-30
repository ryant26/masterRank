const shell = require('shelljs');
const logger = require('winston');
const spawn = require('child_process').spawn;

let processes = [];

module.exports = {

    checkExist: function(command) {
        if (!shell.which(command)) {
            logger.error(`Needs ${command} to exist`);
            shell.exit(1);
        }
    },

    startProcess: function(command, ...startStrings) {
        let process = shell.exec(command, {async: true});
        return new Promise((resolve, reject) => {
            process.stdout.on('data', (data) => {
                logger.info(data);
                if (startStrings) {
                    let stringForm = data.toString();
                    if (startStrings.some((startString) => stringForm.includes(startString))) {
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
    },

    startNodeProcess: function(cwd, filePath, env, startupString) {
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
    },

    killAllNodeProcesses: function() {
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
    }
};