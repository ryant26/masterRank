const app = require('http').createServer();
const io = require('socket.io')(app);
const redisAdapter = require('socket.io-redis');
const config = require('config');
const logger = require('./services/logger').sysLogger;
const groupControllerFactory = require('./controllers/factories/groupControllerFactory');
const playerControllerFactory = require('./controllers/factories/playerControllerFactory');
const authenticationControllerFactory = require('./controllers/factories/authenticationControllerFactory');
const dependencyMocker = require('./mockingUtilities/mockDependencies');
const serverEvents = require('./socketEvents/serverEvents');

const port = config.get('port');
const regionNamespaces = ['us', 'eu', 'apac'];
const platformNamespaces = ['pc', 'ps', 'xb'];

dependencyMocker.mockAllDependenciesForEnvironment();

let onAuthenticated = function (namespace, socket, token) {
    socket.removeAllListeners();
    playerControllerFactory.getPlayerController({namespace, socket, token});
    groupControllerFactory.getGroupController({namespace, socket, token});
};

let setupRegion = function(namespace) {
    namespace.on(serverEvents.connection, (socket) => {
        authenticationControllerFactory.getAuthenticationController({
            socket,
            authenticatedCallback: (token) => {
                onAuthenticated(namespace, socket, token);
            }
        });
    });
};

io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));
app.listen(port, () => {
    logger.info(`listening on port ${port}`);
});

regionNamespaces.forEach((region) => {
    platformNamespaces.forEach((platform) => {
        let namespace = io.of(`/${region}/${platform}`);
        setupRegion(namespace);
    });
});
