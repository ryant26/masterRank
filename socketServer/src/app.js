let app = require('http').createServer();
let io = require('socket.io')(app);
let config = require('config');
let logger = require('winston');
let PlayerController = require('./controllers/PlayerController');

const port = config.get('port');

app.listen(port, () => {
    logger.info(`listening on port ${port}`);
});

io.on('connection', (socket) => {
    new PlayerController(socket);
    socket.emit('initialData', {hello: 'world'});
});