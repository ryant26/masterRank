const chai = require('chai');
const assert = chai.assert;
const randomString = require('randomstring');
const serverEvents = require('../../../src/socketEvents/serverEvents');
const clientEvents = require('../../../src/socketEvents/clientEvents');
const CommonUtilities = require('../CommonUtilities');
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
        socket.emit(serverEvents.addHero, {heroName: randomString.generate(),  priority: 1});
        socket.emit(serverEvents.addHero, {heroName: randomString.generate(),  priority: 1});
        socket.emit(serverEvents.addHero, {heroName: randomString.generate(),  priority: 1});

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
        let priority = 1;

        socket2 = commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.regions.us);

        socket2.on(clientEvents.initialData, () => {
            socket.emit(serverEvents.addHero, {heroName, priority});
        });

        socket2.on('heroAdded', (hero) => {
            assert.equal(hero.heroName, heroName);
            assert.equal(hero.priority, priority);
            done();
        });
    });

    it('should not call the heroAdded event for players in other ranks', function(done) {
        let socket2;
        let heroName = randomString.generate();
        let priority = 1;

        socket2 = commonUtilities.getAuthenticatedSocket('goldPlayer#1234', commonUtilities.regions.us);

        socket2.on(clientEvents.initialData, () => {
            socket.emit(serverEvents.addHero, {heroName, priority});
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
        let priority = 1;

        socket2 = commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.regions.eu);

        socket2.on(clientEvents.initialData, () => {
            socket.emit(serverEvents.addHero, {heroName, priority});
        });

        socket2.on('heroAdded', () => {
            assert.fail();
        });

        //Give some time for the handler to be called
        setTimeout(() => {
            done();
        }, 100);
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
});