let logger = require('winston');

const Api = function(socket) {
    socket.on('test', () => {
        logger.info('received test');
    });
};

module.exports = Api;
