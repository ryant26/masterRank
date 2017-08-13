let chai = require('chai');
let assert = chai.assert;
let randomString = require('randomstring');
let serverEvents = require('../../../src/socketEvents/serverEvents');
let clientEvents = require('../../../src/socketEvents/clientEvents');
let commonUtilities = require('../commonUtilities');

let battleNetId = 'testUser#1234';

// Start the Socket Server
require('../../../src/app');

describe('Connection', function() {
    let socket;

    before(function () {
        socket = commonUtilities.getAuthenticatedSocket(battleNetId, commonUtilities.connectionUrlUs);
    });

    after(function() {
        commonUtilities.closeOpenedSockets();
    });

    it('should call initialData on the client upon connect', function(done) {
        socket.on(clientEvents.initialData, (data) => {
            assert.isArray(data);
            assert.isEmpty(data);
            done();
        });
    });
});

describe('disconnect', function() {
    let socket;

    beforeEach(function () {
        socket = commonUtilities.getAuthenticatedSocket(battleNetId, commonUtilities.connectionUrlUs);
    });

    afterEach(function() {
        commonUtilities.closeOpenedSockets();
    });

    it('should remove all heros from the meta list', function(done) {
        socket.emit(serverEvents.addHero, randomString.generate());
        socket.emit(serverEvents.addHero, randomString.generate());
        socket.emit(serverEvents.addHero, randomString.generate());

        setTimeout(function() {
            socket.close();
        }, 50);

        // Ensure hero is fully added before we connect the 2nd user
        setTimeout(function() {
            let socket2 = commonUtilities.getAuthenticatedSocket('testUser2#1234', commonUtilities.connectionUrlUs);

            socket2.on(clientEvents.initialData, (data) => {
                assert.isEmpty(data);
                done();
            });
        }, 100);
    });

    it('should call the removeHero event when a hero is removed', function(done) {
        let heroName = randomString.generate();
        socket.emit(serverEvents.addHero, heroName);

        let socket2 = commonUtilities.getAuthenticatedSocket('testUser2#1234', commonUtilities.connectionUrlUs);


        socket2.on('heroRemoved', (hero) => {
            assert.equal(hero.heroName, heroName);
            done();
        });

        setTimeout(function() {
            socket.close();
        }, 50);

    });
});