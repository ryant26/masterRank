const app = require('http').createServer();
const io = require('socket.io')(app);
const config = require('config');
const logger = require('winston');
const groupControllerFactory = require('./controllers/factories/groupControllerFactory');
const playerControllerFactory = require('./controllers/factories/playerControllerFactory');
const AuthenticationController = require('./controllers/AuthenticationController');


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