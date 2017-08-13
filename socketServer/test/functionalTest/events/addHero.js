let chai = require('chai');
let assert = chai.assert;
let randomString = require('randomstring');
let serverEvents = require('../../../src/socketEvents/serverEvents');
let clientEvents = require('../../../src/socketEvents/clientEvents');
let commonUtilities = require('../commonUtilities');

let battleNetId = 'testUser#1234';

// Start the Socket Server
require('../../../src/app');

describe(serverEvents.addHero, function() {
    let socket;

    beforeEach(function () {
        socket = commonUtilities.getAuthenticatedSocket(battleNetId, commonUtilities.connectionUrlUs);
    });

    afterEach(function() {
        commonUtilities.closeOpenedSockets();
    });

    it('should handle adding multiple heros for a single player', function(done) {
        socket.emit(serverEvents.addHero, randomString.generate());
        socket.emit(serverEvents.addHero, randomString.generate());
        socket.emit(serverEvents.addHero, randomString.generate());

        // Ensure hero is fully added before we connect the 2nd user
        setTimeout(function() {
            let socket2 = commonUtilities.getAuthenticatedSocket('testUser2#1234', commonUtilities.connectionUrlUs);

            socket2.on(clientEvents.initialData, (data) => {
                assert.lengthOf(data, 3);
                done();
            });
        }, 50);
    });

    it('should call the heroAdded event on all connected clients', function(done) {
        let socket2;
        let heroName = randomString.generate();

        socket2 = commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.connectionUrlUs);

        socket2.on(clientEvents.initialData, () => {
            socket.emit(serverEvents.addHero, heroName);
        });

        socket2.on('heroAdded', (hero) => {
            assert.equal(hero.heroName, heroName);
            done();
        });
    });

    it('should not call the heroAdded event for players in other ranks', function(done) {
        let socket2;
        let heroName = randomString.generate();

        socket2 = commonUtilities.getAuthenticatedSocket('goldPlayer#1234', commonUtilities.connectionUrlUs);

        socket2.on(clientEvents.initialData, () => {
            socket.emit(serverEvents.addHero, heroName);
        });

        socket2.on('heroAdded', () => {
            assert.fail();
        });

        //Give some time for the handler to be called
        setTimeout(() => {
            done();
        }, 100);
    });

    it('should not call the heroAdded event for players in other regions', function(done) {
        let socket2;
        let heroName = randomString.generate();

        socket2 = commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.connectionUrlEu);

        socket2.on(clientEvents.initialData, () => {
            socket.emit(serverEvents.addHero, heroName);
        });

        socket2.on('heroAdded', () => {
            assert.fail();
        });

        //Give some time for the handler to be called
        setTimeout(() => {
            done();
        }, 100);
    });
});