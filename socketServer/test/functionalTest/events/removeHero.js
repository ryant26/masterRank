const chai = require('chai');
const assert = chai.assert;
const randomString = require('randomstring');
const serverEvents = require('../../../src/socketEvents/serverEvents');
const clientEvents = require('../../../src/socketEvents/clientEvents');
const CommonUtilities = require('../CommonUtilities');
const exceptions = require('../../../src/validators/exceptions/exceptions');

// Start the Socket Server
require('../../../src/app');

let battleNetId;
let commonUtilities = new CommonUtilities();

describe(serverEvents.removeHero, function() {
    let socket;

    beforeEach(function() {
        battleNetId = randomString.generate();
        socket = commonUtilities.getAuthenticatedSocket(battleNetId, commonUtilities.regions.us);
        commonUtilities.mockPlayerApi();
    });

    afterEach(function() {
        commonUtilities.closeOpenedSockets();
        commonUtilities.restorePlayerApi();
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
            let socket2 = commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.regions.us);

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

        socket2 = commonUtilities.getAuthenticatedSocket('goldPlayer#1234', commonUtilities.regions.us);

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

        socket2 = commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.regions.us);

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