let chai = require('chai');
let assert = chai.assert;
let io = require('socket.io-client');
let config = require('config');

// Start the Socket Server
require('../../src/app');

let connectionUrl = `${config.get('url')}:${config.get('port')}`;
let connectionUrlUs = `${connectionUrl}/us`;
let connectionUrlEu = `${connectionUrl}/eu`;

let battleNetId = 'testUser#1234';

describe('Connection', function() {
    let socket;

    before(function () {
        socket = io(connectionUrlUs);
        socket.emit('authenticate', {battleNetId});
    });

    after(function() {
        socket.close();
    });

    it('should call initialData on the client upon connect', function(done) {
        socket.on('initialData', (data) => {
            assert.isArray(data);
            assert.isEmpty(data);
            done();
        });
    });
});

describe('initalData', function() {
    let socket;

    before(function () {
        socket = io(connectionUrlUs);
        socket.emit('authenticate', {battleNetId});
    });

    after(function() {
        socket.close();
    });

    it('should return a list of all heros available for grouping', function(done) {
        let heroName = 'Soldier76';
        socket.emit('addHero', heroName);

        // Ensure hero is fully added before we connect the 2nd user
        setTimeout(function() {
            let socket2 = io(connectionUrlUs, {forceNew: true});
            socket2.emit('authenticate', {battleNetId: 'testUser2#1234'});

            socket2.on('initialData', (data) => {
                assert.lengthOf(data, 1);
                assert.equal(data[0].heroName, heroName);
                socket2.close();
                done();
            });
        }, 50);
    });

    it('should not return heros from a different rank', function(done) {
        let heroName = 'Widowmaker';
        socket.emit('addHero', heroName);

        // Ensure hero is fully added before we connect the 2nd user
        setTimeout(function() {
            let socket2 = io(connectionUrlUs, {forceNew: true});
            socket2.emit('authenticate', {battleNetId: 'goldPlayer#1234'});

            socket2.on('initialData', (data) => {
                assert.isEmpty(data);
                socket2.close();
                done();
            });
        }, 50);
    });

    it('should not return heros from a different region', function(done) {
        let heroName = 'Widowmaker';
        socket.emit('addHero', heroName);

        // Ensure hero is fully added before we connect the 2nd user
        setTimeout(function() {
            let socket2 = io(connectionUrlEu, {forceNew: true});
            socket2.emit('authenticate', {battleNetId: 'testUser2#1234'});

            socket2.on('initialData', (data) => {
                assert.isEmpty(data);
                socket2.close();
                done();
            });
        }, 50);
    });
});