const winston = require('winston');
const config = require('config');
require('winston-logstash');

const logstashHost = config.get('logstash.host');
const systemPort = config.get('logstash.systemPort');
const apachePort = config.get('logstash.apachePort');

const getWinstonLogger = function () {
    return new (winston.Logger)({
        transports: [new (winston.transports.Console)()]
    });
};

const sysLogger = getWinstonLogger();
sysLogger.add(winston.transports.Logstash, {
    port: systemPort,
    node_name: 'heroApiServer',
    host: logstashHost
});

const apacheLogger = getWinstonLogger();
apacheLogger.add(winston.transports.Logstash, {
    port: apachePort,
    node_name: 'heroApiServer',
    host: logstashHost
});

apacheLogger.stream = {
    write: function(message){
        apacheLogger.info(message);
    }
};

module.exports = {
    sysLogger,
    apacheLogger
};