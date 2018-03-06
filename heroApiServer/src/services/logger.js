const {createLogger, transports, format} = require('winston');

const config = require('config');
const logLevel = config.get('logLevel');

const sysLogger = createLogger({
    level: logLevel,
    format: format.simple(),
    transports: [new transports.Console()]
});

sysLogger.stream = {
    write: function(message){
        sysLogger.info(message);
    }
};

module.exports = {
    sysLogger
};