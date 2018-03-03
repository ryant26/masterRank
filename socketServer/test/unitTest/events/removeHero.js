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
        return commonUtilities.closeOpenedSockets();
    });

    it('should send out hero removed event', function(done) {
        let heroName = 'tracer';
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
        let heroName = 'tracer';
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
        let heroName = 'tracer';
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

    it('should not call the heroRemoved event for players outside +/- 1 rank', function(done) {
        let heroName = 'tracer';
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

    it('should call the heroRemoved event for players inside + 1 rank', function(done) {
        let heroName = 'tracer';
        let priority = 5;

        commonUtilities.getAuthenticatedSocket('goldPlayer#1234', commonUtilities.regions.us).then((data) => {
            commonUtilities.getAuthenticatedSocket('platinumPlayer#1234', commonUtilities.regions.us).then((data2) => {
                let goldPlayerSocket = data.socket;
                let platinumPlayerSocket = data2.socket;

                goldPlayerSocket.on(clientEvents.heroAdded, () => {
                    goldPlayerSocket.emit(serverEvents.removeHero, heroName);
                });

                platinumPlayerSocket.on(clientEvents.heroRemoved, () => {
                    done();
                });

                goldPlayerSocket.emit(serverEvents.addHero, {heroName, priority});
            });
        });
    });

    it('should call the heroRemoved event for players inside - 1 rank', function(done) {
        let heroName = 'tracer';
        let priority = 5;

        commonUtilities.getAuthenticatedSocket('goldPlayer#1234', commonUtilities.regions.us).then((data) => {
            commonUtilities.getAuthenticatedSocket('silverPlayer#1234', commonUtilities.regions.us).then((data2) => {
                let goldPlayerSocket = data.socket;
                let silverPlayerSocket = data2.socket;

                goldPlayerSocket.on(clientEvents.heroAdded, () => {
                    goldPlayerSocket.emit(serverEvents.removeHero, heroName);
                });

                silverPlayerSocket.on(clientEvents.heroRemoved, () => {
                    done();
                });

                goldPlayerSocket.emit(serverEvents.addHero, {heroName, priority});
            });
        });
    });

    it('should not call the heroRemoved event for players in other regions', function(done) {
        let heroName = 'tracer';
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