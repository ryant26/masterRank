let app = require('http').createServer();
let io = require('socket.io')(app);
let config = require('config');
let logger = require('winston');
let PlayerController = require('./controllers/PlayerController');
let AuthenticationController = require('./controllers/AuthenticationController');
let PlayerClient = require('./apiClients/PlayerClient');
let RedisClient = require('./apiClients/RedisClient');

const port = config.get('port');

let onAuthenticated = function (socket, region) {
    new PlayerController({socket, region, PlayerClient, RedisClient, io});
};

let setupRegion = function(namespace, region) {
    namespace.on('connection', (socket) => {
        new AuthenticationController({
            socket,
            authenticatedCallback: () => {
                onAuthenticated(socket, region);
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