const chai = require('chai');
const assert = chai.assert;
const randomString = require('randomstring');
const serverEvents = require('../../../src/socketEvents/serverEvents');
const clientEvents = require('../../../src/socketEvents/clientEvents');
const CommonUtilities = require('../commonUtilities');
const exceptions = require('../../../src/validators/exceptions/exceptions');

let battleNetId;
let commonUtilities = new CommonUtilities();

// Start the Socket Server
require('../../../src/app');

describe(serverEvents.addHero, function() {
    let socket;

    beforeEach(function () {
        battleNetId = randomString.generate();
        socket = commonUtilities.getAuthenticatedSocket(battleNetId, commonUtilities.regions.us);
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
            let socket2 = commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.regions.us);

            socket2.on(clientEvents.initialData, (data) => {
                assert.lengthOf(data, 3);
                done();
            });
        }, 150);
    });

    it('should call the heroAdded event on all connected clients', function(done) {
        let socket2;
        let heroName = randomString.generate();

        socket2 = commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.regions.us);

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

        socket2 = commonUtilities.getAuthenticatedSocket('goldPlayer#1234', commonUtilities.regions.us);

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

        socket2 = commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.regions.eu);

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

    it('should reject invalid heroNames', function(done) {
        socket.on(clientEvents.error.addHero, (error) => {
            assert.equal(error.err, exceptions.invalidHeroName);
            done();
        });

        socket.emit(serverEvents.addHero, null);
    });
});