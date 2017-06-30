let chai = require('chai');
let assert = chai.assert;
let io = require('socket.io-client');
let config = require('config');

// Start the Socket Server
require('../../src/app');

let connectionUrl = `${config.get('url')}:${config.get('port')}/us`;
let battleNetId = 'testUser#1234';

describe('Connection', function() {
    let socket;

    before(function () {
        socket = io(connectionUrl);
        socket.emit('authenticate', {battleNetId});
    });

    it('should call initialData on the client upon connect', function(done) {
        socket.on('initialData', (data) => {
            assert.equal(data.hello, 'world');
            done();
        });
    });
});