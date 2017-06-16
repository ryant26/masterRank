let app = require('http').createServer();
let io = require('socket.io')(app);
let config = require('config');
let logger = require('winston');
let ServerApi = require('./serverApi/Api');

const port = config.get('port');

app.listen(port, () => {
    logger.info(`listening on port ${port}`);
});

io.on('connection', (socket) => {
    new ServerApi(socket);
    socket.emit('initialData', {hello: 'world'});
});