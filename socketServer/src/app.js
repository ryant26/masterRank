let app = require('http').createServer();
let io = require('socket.io')(app);
let config = require('config');
let logger = require('winston');
let groupControllerFactory = require('./controllers/factories/groupControllerFactory');
let playerControllerFactory = require('./controllers/factories/playerControllerFactory');
let AuthenticationController = require('./controllers/AuthenticationController');


const port = config.get('port');

let onAuthenticated = function (namespace, socket, region) {
    socket.removeAllListeners();
    playerControllerFactory.getPlayerController({namespace, socket, region});
    groupControllerFactory.getGroupController({namespace, socket, region});
};

let setupRegion = function(namespace, region) {
    namespace.on('connection', (socket) => {
        new AuthenticationController({
            socket,
            authenticatedCallback: () => {
                onAuthenticated(namespace, socket, region);
            }
        });
    });
};

app.listen(port, () => {
    logger.info(`listening on port ${port}`);
});

let usRegion = io.of('/us');
let euRegion = io.of('/eu');
let asRegion = io.of('/as');

setupRegion(usRegion, 'us');
setupRegion(euRegion, 'eu');
setupRegion(asRegion, 'as');