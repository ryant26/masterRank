let app = require('http').createServer();
let io = require('socket.io')(app);
let config = require('config');
let logger = require('winston');
let PlayerController = require('./controllers/PlayerController');
let GroupController = require('./controllers/GroupController');
let AuthenticationController = require('./controllers/AuthenticationController');


const port = config.get('port');

let onAuthenticated = function (namespace, socket, region) {
    new PlayerController({namespace, socket, region});
    new GroupController({namespace, socket, region});
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