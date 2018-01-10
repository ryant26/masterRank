const chai = require('chai');
const assert = chai.assert;
const randomString = require('randomstring');
const serverEvents = require('../../../src/socketEvents/serverEvents');
const clientEvents = require('../../../src/socketEvents/clientEvents');
const CommonUtilities = require('../CommonUtilities');
const mockingUtilities = require('../mockingUtilities');
const exceptions = require('../../../src/validators/exceptions/exceptions');

let platformDisplayName;
let commonUtilities = new CommonUtilities();
// Start the Socket Server
require('../../../src/app');

describe(serverEvents.addHero, function() {
    let socket;
    let initialData;

    beforeEach(function () {
        platformDisplayName = randomString.generate();
        return commonUtilities.getAuthenticatedSocket(platformDisplayName, commonUtilities.regions.us).then((data) => {
            socket = data.socket;
            initialData = data.initialData;
        });
    });

    afterEach(function() {
        commonUtilities.closeOpenedSockets();
        mockingUtilities.restoreAll();
    });

    it('should handle adding multiple heros for a single player', function(done) {
        socket.emit(serverEvents.addHero, {heroName: randomString.generate(),  priority: 1});
        socket.emit(serverEvents.addHero, {heroName: randomString.generate(),  priority: 1});
        socket.emit(serverEvents.addHero, {heroName: randomString.generate(),  priority: 1});

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
        let heroName = randomString.generate();
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

    it('should not call the heroAdded event for players in other ranks', function(done) {
        let heroName = randomString.generate();
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

    it('should not call the heroAdded event for players in other regions', function(done) {
        let heroName = randomString.generate();
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
        mockingUtilities.makeHeroAPIReturnError('an error occured!!');

        socket.on(clientEvents.error.addHero, (error) => {
            assert.equal(error.err, exceptions.errorAddingHero);
            assert.equal(error.heroName, heroName);
            done();
        });

        socket.emit(serverEvents.addHero, {heroName: 'genji', priority: 1});
    });
});