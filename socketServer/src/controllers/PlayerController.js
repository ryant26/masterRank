let logger = require('winston');

const PlayerController = function(socket) {
    let token = socket.token;

    socket.on('setRegion', (region, fn) => {
        // Set the users region
        // Get rank
        // Call the fn with all hero's in that player's rank && region
    });
};

module.exports = PlayerController;
