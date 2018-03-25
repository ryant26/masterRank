const chai = require('chai');
const assert = chai.assert;
const randomString = require('randomstring');
const serverEvents = require('../../../../shared/libs/socketEvents/serverEvents');
const clientEvents = require('../../../../shared/libs/socketEvents/clientEvents');
const CommonUtilities = require('../CommonUtilities');
const mockingUtilities = require('../mockingUtilities');
const exceptions = require('../../../src/validators/exceptions/exceptions');

let platformDisplayName;
let commonUtilities = new CommonUtilities();
// Start the Socket Server
require('../../../src/app');

describe(serverEvents.addHero, function() {
    let socket;

    beforeEach(function () {
        platformDisplayName = randomString.generate();
        return commonUtilities.getAuthenticatedSocket(platformDisplayName, commonUtilities.regions.us).then((data) => {
            socket = data.socket;
        });
    });

    afterEach(function() {
        mockingUtilities.restoreAll();
        return commonUtilities.closeOpenedSockets();
    });

    it('should handle adding multiple heros for a single player', function(done) {
        socket.emit(serverEvents.addHero, {heroName: 'tracer',  priority: 1});
        socket.emit(serverEvents.addHero, {heroName: 'genji',  priority: 1});
        socket.emit(serverEvents.addHero, {heroName: 'winston',  priority: 1});

        // Ensure hero is fully added before we connect the 2nd user
        setTimeout(function() {
            let socket2 = commonUtilities.getSocket(randomString.generate(), commonUtilities.regions.us);

            socket2.on(clientEvents.initialData, (data) => {
                assert.lengthOf(data, 3);
                done();
            });

            socket2.authenticate();
        }, 150);
    });

    it('should call the heroAdded event on all connected clients', function(done) {
        let heroName = 'tracer';
        let priority = 1;

        commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.regions.us).then((data) => {
            data.socket.on('heroAdded', (hero) => {
                assert.equal(hero.heroName, heroName);
                assert.equal(hero.priority, priority);
                done();
            });

            socket.emit(serverEvents.addHero, {heroName, priority});
        });
    });

    it('should not call the heroAdded event for players in ranks outside the +/- 1 range', function(done) {
        let heroName = 'tracer';
        let priority = 1;

        commonUtilities.getAuthenticatedSocket('goldPlayer#1234', commonUtilities.regions.us).then((data) => {
            let socket2 = data.socket;

            socket2.on('heroAdded', () => {
                assert.fail();
            });

            socket.emit(serverEvents.addHero, {heroName, priority});

            //Give some time for the handler to be called
            setTimeout(() => {
                done();
            }, 100);
        });
    });

    it('should call the heroAdded event for players in ranks inside the + 1 range', function(done) {
        let heroName = 'tracer';
        let priority = 1;


        commonUtilities.getAuthenticatedSocket('goldPlayer#1234', commonUtilities.regions.us).then((data) => {
            commonUtilities.getAuthenticatedSocket('silverPlayer#1234', commonUtilities.regions.us).then((data2) => {
                let goldPlayerSocket = data.socket;
                let silverPlayerSocket = data2.socket;

                goldPlayerSocket.on('heroAdded', () => {
                    done();
                });

                silverPlayerSocket.emit(serverEvents.addHero, {heroName, priority});
            });
        });
    });

    it('should call the heroAdded event for players in ranks inside the - 1 range', function(done) {
        let heroName = 'tracer';
        let priority = 1;


        commonUtilities.getAuthenticatedSocket('bronzePlayer#1234', commonUtilities.regions.us).then((data) => {
            commonUtilities.getAuthenticatedSocket('silverPlayer#1234', commonUtilities.regions.us).then((data2) => {
                let bronzePlayerSocket = data.socket;
                let silverPlayerSocket = data2.socket;

                bronzePlayerSocket.on('heroAdded', () => {
                    done();
                });

                silverPlayerSocket.emit(serverEvents.addHero, {heroName, priority});
            });
        });
    });

    it('should not call the heroAdded event for players in other regions', function(done) {
        let heroName = 'tracer';
        let priority = 1;

        commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.regions.eu).then((data) => {
            let socket2 = data.socket;

            socket2.on('heroAdded', () => {
                assert.fail();
            });

            socket.emit(serverEvents.addHero, {heroName, priority});

            //Give some time for the handler to be called
            setTimeout(() => {
                done();
            }, 100);
        });
    });

    it('should reject null heroNames', function(done) {
        socket.on(clientEvents.error.addHero, (error) => {
            assert.equal(error.err, exceptions.invalidHeroName);
            done();
        });

        socket.emit(serverEvents.addHero, {heroName: null});
    });

    it('should reject undefined heroNames', function(done) {
        socket.on(clientEvents.error.addHero, (error) => {
            assert.equal(error.err, exceptions.invalidHeroName);
            done();
        });

        socket.emit(serverEvents.addHero, {heroName: undefined});
    });

    it('should reject too small priority', function(done) {
        socket.on(clientEvents.error.addHero, (error) => {
            assert.equal(error.err, exceptions.invalidPriority);
            done();
        });

        socket.emit(serverEvents.addHero, {heroName: 'genji', priority: 0});
    });

    it('should reject too large priority', function(done) {
        socket.on(clientEvents.error.addHero, (error) => {
            assert.equal(error.err, exceptions.invalidPriority);
            done();
        });

        socket.emit(serverEvents.addHero, {heroName: 'genji', priority: 6});
    });

    it('should reject priority of wrong type', function(done) {
        socket.on(clientEvents.error.addHero, (error) => {
            assert.equal(error.err, exceptions.invalidPriority);
            done();
        });

        socket.emit(serverEvents.addHero, {heroName: 'genji', priority: '3'});
    });

    it('should reject null priority', function(done) {
        socket.on(clientEvents.error.addHero, (error) => {
            assert.equal(error.err, exceptions.invalidPriority);
            done();
        });

        socket.emit(serverEvents.addHero, {heroName: 'genji', priority: null});
    });

    it('should reject undefined priority', function(done) {
        socket.on(clientEvents.error.addHero, (error) => {
            assert.equal(error.err, exceptions.invalidPriority);
            done();
        });

        socket.emit(serverEvents.addHero, {heroName: 'genji', priority: undefined});
    });

    it('should reject invalid data object', function(done) {
        socket.on(clientEvents.error.addHero, (error) => {
            assert.equal(error.err, exceptions.invalidHeroName);
            done();
        });

        socket.emit(serverEvents.addHero, null);
    });

    it('should return an error when the heroAPI throws an error', function(done) {
        const heroName = 'genji';
        const priority = 1;
        mockingUtilities.makeHeroAPIReturnError('an error occured!!');

        socket.on(clientEvents.error.addHero, (error) => {
            assert.equal(error.err, exceptions.errorAddingHero);
            assert.equal(error.hero.heroName, heroName);
            assert.equal(error.hero.priority, priority);
            done();
        });

        socket.emit(serverEvents.addHero, {heroName, priority});
    });

    it('should not allow anyone to have more than 10 heroes', function(done) {
        const heroNames = ['genji', 'tracer', 'dva', 'mercy', 'winston', 'zarya', 'roadhog', 'doomfist', 'ana', 'hanzo', 'junkrat'];
        let i = 0;
        let errorReceived = false;

        const addHeroFromList = (index) => socket.emit(serverEvents.addHero, {heroName: heroNames[index], priority: 1});

        socket.on(clientEvents.error.addHero, (error) => {
            errorReceived = true;
            assert.equal(error.err, exceptions.errorAddingHero);
            done();
        });

        socket.on(clientEvents.heroAdded, () => {
            if (!errorReceived) {
                addHeroFromList(++i);
            }
        });

        addHeroFromList(i);
    });
});