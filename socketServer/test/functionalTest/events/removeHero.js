let chai = require('chai');
let assert = chai.assert;
let randomString = require('randomstring');
let serverEvents = require('../../../src/socketEvents/serverEvents');
let clientEvents = require('../../../src/socketEvents/clientEvents');
let commonUtilities = require('../commonUtilities');
let exceptions = require('../../../src/validators/exceptions/exceptions');

// Start the Socket Server
require('../../../src/app');

let battleNetId = 'testUser#1234';

describe(serverEvents.removeHero, function() {
    let socket;

    beforeEach(function() {
        socket = commonUtilities.getAuthenticatedSocket(battleNetId, commonUtilities.connectionUrlUs);
    });

    afterEach(function() {
        commonUtilities.closeOpenedSockets();
    });

    it('should send out hero removed event', function(done) {
        let heroName = randomString.generate();

        socket.on(clientEvents.initialData, () => {
            socket.emit(serverEvents.addHero, heroName);
        });

        socket.on(clientEvents.heroAdded, () => {
            socket.emit(serverEvents.removeHero, heroName);
        });

        socket.on(clientEvents.heroRemoved, (data) => {
            assert.equal(data.heroName, heroName);
            done();
        });
    });

    it('should remove heros from initalData', function(done) {
        let heroName = randomString.generate();

        socket.on(clientEvents.initialData, () => {
            socket.emit(serverEvents.addHero, heroName);
        });

        socket.on(clientEvents.heroAdded, () => {
            socket.emit(serverEvents.removeHero, heroName);
        });

        socket.on(clientEvents.heroRemoved, () => {
            let socket2 = commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.connectionUrlUs);

            socket2.on(clientEvents.initialData, (data) => {
                assert.lengthOf(data, 0);
                done();
            });
        });
    });

    it('should call the heroRemoved event on all connected clients', function(done) {
        let socket2;
        let heroName = randomString.generate();

        socket2 = commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.connectionUrlUs);

        socket2.on(clientEvents.initialData, () => {
            socket2.emit(serverEvents.addHero, heroName);
        });

        socket2.on(clientEvents.heroAdded, () => {
            socket2.emit(serverEvents.removeHero, heroName);
        });

        socket.on(clientEvents.heroRemoved, (data) => {
            assert.equal(data.heroName, heroName);
            done();
        });
    });

    it('should not call the heroRemoved event for players in other ranks', function(done) {
        let socket2;
        let heroName = randomString.generate();

        socket2 = commonUtilities.getAuthenticatedSocket('goldPlayer#1234', commonUtilities.connectionUrlUs);

        socket2.on(clientEvents.initialData, () => {
            socket2.emit(serverEvents.addHero, heroName);
        });

        socket2.on(clientEvents.heroAdded, () => {
            socket2.emit(serverEvents.removeHero, heroName);
        });

        socket.on(clientEvents.heroRemoved, () => {
            assert.fail();
        });

        //Give some time for the handler to be called
        setTimeout(() => {
            done();
        }, 100);
    });

    it('should not call the heroRemoved event for players in other regions', function(done) {
        let socket2;
        let heroName = randomString.generate();

        socket2 = commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.connectionUrlEu);

        socket2.on(clientEvents.initialData, () => {
            socket2.emit(serverEvents.addHero, heroName);
        });

        socket2.on(clientEvents.heroAdded, () => {
            socket2.emit(clientEvents.heroRemoved, heroName);
        });

        socket.on(clientEvents.heroRemoved, () => {
            assert.fail();
        });

        //Give some time for the handler to be called
        setTimeout(() => {
            done();
        }, 100);
    });

    it('should reject invalid heroNames', function(done) {
        socket.on(clientEvents.error.removeHero, (error) => {
            assert.equal(error.err, exceptions.invalidHeroName);
            done();
        });

        socket.emit(serverEvents.removeHero, null);
    });
});