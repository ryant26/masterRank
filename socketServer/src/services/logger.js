const winston = require('winston');
const config = require('config');
require('winston-logstash');

const logstashHost = config.get('logstash.host');
const systemPort = config.get('logstash.systemPort');

const getWinstonLogger = function () {
    return new (winston.Logger)({
        transports: [new (winston.transports.Console)()]
    });
};

const sysLogger = getWinstonLogger();
sysLogger.add(winston.transports.Logstash, {
    port: systemPort,
    node_name: 'socketServer',
    host: logstashHost
});

module.exports = {
    sysLogger
};