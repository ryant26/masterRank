let logger = require('winston');

const PlayerController = function(config) {
    let socket = config.socket;
    let token = socket.token;

    socket.emit('initialData', {hello: 'world'});
};

module.exports = PlayerController;
