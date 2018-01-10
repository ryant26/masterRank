const chai = require('chai');
const assert = chai.assert;
const randomString = require('randomstring');
const serverEvents = require('../../../src/socketEvents/serverEvents');
const clientEvents = require('../../../src/socketEvents/clientEvents');
const CommonUtilities = require('../CommonUtilities');
const exceptions = require('../../../src/validators/exceptions/exceptions');

// Start the Socket Server
require('../../../src/app');

let platformDisplayName;
let commonUtilities = new CommonUtilities();

describe(serverEvents.removeHero, function() {
    let socket;

    beforeEach(function() {
        platformDisplayName = randomString.generate();
        return commonUtilities.getAuthenticatedSocket(platformDisplayName, commonUtilities.regions.us).then((data) => {
            socket = data.socket;
        });
    });

    afterEach(function() {
        commonUtilities.closeOpenedSockets();
    });

    it('should send out hero removed event', function(done) {
        let heroName = randomString.generate();
        let priority = 3;

        socket.on(clientEvents.heroAdded, () => {
            socket.emit(serverEvents.removeHero, heroName);
        });

        socket.on(clientEvents.heroRemoved, (data) => {
            assert.equal(data.heroName, heroName);
            done();
        });

        socket.emit(serverEvents.addHero, {heroName, priority});

    });

    it('should remove heros from initalData', function(done) {
        let heroName = randomString.generate();
        let priority = 4;

        socket.on(clientEvents.heroAdded, () => {
            socket.emit(serverEvents.removeHero, heroName);
        });

        socket.on(clientEvents.heroRemoved, () => {
            commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.regions.us).then(({initialData}) => {
                assert.lengthOf(initialData, 0);
                done();
            });
        });

        socket.emit(serverEvents.addHero, {heroName, priority});
    });

    it('should call the heroRemoved event on all connected clients', function(done) {
        let heroName = randomString.generate();
        let priority = 4;

        commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.connectionUrlUs).then((data) => {
            let socket2 = data.socket;

            socket2.on(clientEvents.heroAdded, () => {
                socket2.emit(serverEvents.removeHero, heroName);
            });

            socket.on(clientEvents.heroRemoved, (data) => {
                assert.equal(data.heroName, heroName);
                done();
            });

            socket2.emit(serverEvents.addHero, {heroName, priority});

        });
    });

    it('should not call the heroRemoved event for players in other ranks', function(done) {
        let heroName = randomString.generate();
        let priority = 5;

        commonUtilities.getAuthenticatedSocket('goldPlayer#1234', commonUtilities.regions.us).then((data) => {
            let socket2 = data.socket;

            socket2.on(clientEvents.heroAdded, () => {
                socket2.emit(serverEvents.removeHero, heroName);
            });

            socket.on(clientEvents.heroRemoved, () => {
                assert.fail();
            });

            socket2.emit(serverEvents.addHero, {heroName, priority});

            //Give some time for the handler to be called
            setTimeout(() => {
                done();
            }, 100);
        });
    });

    it('should not call the heroRemoved event for players in other regions', function(done) {
        let heroName = randomString.generate();
        let priority = 4;

        commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.regions.us).then((data) => {
            let socket2 = data.socket;

            socket2.on(clientEvents.heroAdded, () => {
                socket2.emit(clientEvents.heroRemoved, heroName);
            });

            socket.on(clientEvents.heroRemoved, () => {
                assert.fail();
            });

            socket2.emit(serverEvents.addHero, {heroName, priority});

            //Give some time for the handler to be called
            setTimeout(() => {
                done();
            }, 100);
        });
    });

    it('should reject invalid heroNames', function(done) {
        socket.on(clientEvents.error.removeHero, (error) => {
            assert.equal(error.err, exceptions.invalidHeroName);
            done();
        });

        socket.emit(serverEvents.removeHero, null);
    });
});