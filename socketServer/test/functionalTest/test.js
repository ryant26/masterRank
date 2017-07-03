let chai = require('chai');
let assert = chai.assert;
let io = require('socket.io-client');
let config = require('config');
let randomString = require('randomstring');

// Start the Socket Server
require('../../src/app');

let connectionUrl = `${config.get('url')}:${config.get('port')}`;
let connectionUrlUs = `${connectionUrl}/us`;
let connectionUrlEu = `${connectionUrl}/eu`;
let connectionUrlAs = `${connectionUrl}/as`;

let battleNetId = 'testUser#1234';

let getAuthenticatedSocket = function (battleNetId, socketUrl) {
    let outSocket = io(socketUrl, {forceNew: true});
    outSocket.emit('authenticate', {battleNetId: battleNetId});
    return outSocket;
};

describe('Connection', function() {
    let socket;

    before(function () {
        socket = getAuthenticatedSocket(battleNetId, connectionUrlUs);
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

    beforeEach(function () {
        socket = getAuthenticatedSocket(battleNetId, connectionUrlUs);
    });

    afterEach(function() {
        socket.close();
    });

    it('should return a list of all heros available for grouping', function(done) {
        let heroName = 'Soldier76';
        socket.emit('addHero', heroName);

        // Ensure hero is fully added before we connect the 2nd user
        setTimeout(function() {
            let socket2 = getAuthenticatedSocket('testUser2#1234', connectionUrlUs);

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
            let socket2 = getAuthenticatedSocket('goldPlayer#1234', connectionUrlUs);

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
            let socket2 = getAuthenticatedSocket('testUser2#1234', connectionUrlEu);

            socket2.on('initialData', (data) => {
                assert.isEmpty(data);
                socket2.close();
                done();
            });
        }, 50);
    });

    it('should work in all regions', function() {
        let test = function(regionUrl) {
            return new Promise((resolve) => {
                let heroName = randomString.generate();

                let socket1 = getAuthenticatedSocket(randomString.generate(), regionUrl);
                socket1.on('initialData', function () {
                    socket1.emit('addHero', heroName);
                });

                // Ensure hero is fully added before we connect the 2nd user
                setTimeout(function () {
                    let socket2 = getAuthenticatedSocket('testUser3#1234', regionUrl);

                    socket2.on('initialData', (data) => {
                        assert.lengthOf(data, 1);
                        assert.equal(data[0].heroName, heroName);
                        socket1.close();
                        socket2.close();
                        return resolve();
                    });
                }, 50);
            });
        };

        return Promise.all([test(connectionUrlUs), test(connectionUrlEu), test(connectionUrlAs)]);
    });
});

describe('addHero', function() {
    let socket;

    beforeEach(function () {
        socket = getAuthenticatedSocket(battleNetId, connectionUrlUs);
    });

    afterEach(function() {
        socket.close();
    });

    it('should call the heroAdded event on all connected clients', function(done) {
        let socket2;
        let heroName = randomString.generate();

        socket2 = getAuthenticatedSocket(randomString.generate(), connectionUrlUs);

        socket2.on('initialData', () => {
            socket.emit('addHero', heroName);
        });

        socket2.on('heroAdded', (hero) => {
            assert.equal(hero.heroName, heroName);
            socket2.close();
            done();
        });
    });

    it('should not call the heroAdded event for players in other ranks', function(done) {
        let socket2;
        let heroName = randomString.generate();

        socket2 = getAuthenticatedSocket('goldPlayer#1234', connectionUrlUs);

        socket2.on('initialData', () => {
            socket.emit('addHero', heroName);
        });

        socket2.on('heroAdded', () => {
            assert.fail();
        });

        //Give some time for the handler to be called
        setTimeout(() => {
            socket2.close();
            done();
        }, 100);
    });

    it('should not call the heroAdded event for players in other regions', function(done) {
        let socket2;
        let heroName = randomString.generate();

        socket2 = getAuthenticatedSocket(randomString.generate(), connectionUrlEu);

        socket2.on('initialData', () => {
            socket.emit('addHero', heroName);
        });

        socket2.on('heroAdded', () => {
            assert.fail();
        });

        //Give some time for the handler to be called
        setTimeout(() => {
            socket2.close();
            done();
        }, 100);
    });
});