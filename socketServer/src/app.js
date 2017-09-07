const app = require('http').createServer();
const io = require('socket.io')(app);
const redisAdapter = require('socket.io-redis');
const config = require('config');
const logger = require('winston');
const groupControllerFactory = require('./controllers/factories/groupControllerFactory');
const playerControllerFactory = require('./controllers/factories/playerControllerFactory');
const AuthenticationController = require('./controllers/AuthenticationController');


const port = config.get('port');
const regionNamespaces = ['us', 'eu', 'as'];
const platformNamespaces = ['pc', 'ps', 'xb'];

let onAuthenticated = function (namespace, socket, token) {
    socket.removeAllListeners();
    playerControllerFactory.getPlayerController({namespace, socket, token});
    groupControllerFactory.getGroupController({namespace, socket, token});
};

let setupRegion = function(namespace) {
    namespace.on('connection', (socket) => {
        new AuthenticationController({
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
