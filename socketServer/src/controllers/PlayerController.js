let logger = require('winston');

const PlayerController = function(socket) {
    socket.on('test', () => {
        logger.info('received test');
    });
};

module.exports = PlayerController;
