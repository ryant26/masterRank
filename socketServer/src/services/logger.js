const winston = require('winston');
require('winston-logstash');

const getWinstonLogger = function () {
    return new (winston.Logger)({
        transports: [new (winston.transports.Console)()]
    });
};

const sysLogger = getWinstonLogger();

module.exports = {
    sysLogger
};