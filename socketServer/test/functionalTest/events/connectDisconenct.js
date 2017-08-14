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
        new Promise((resolve) => {
            let heroCount = 0;
            socket.on(clientEvents.heroAdded, () => {
                heroCount++;
                if(heroCount === 3) {
                    resolve();
                }
            });
        }).then(() => {
            socket.close();
        });

        socket.emit(serverEvents.addHero, randomString.generate());
        socket.emit(serverEvents.addHero, randomString.generate());
        socket.emit(serverEvents.addHero, randomString.generate());

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
        let hero;

        commonUtilities.getUserWithAddedHero().then((user) => {
            hero = user.hero;
            user.socket.close();
        });

        socket.on(clientEvents.heroRemoved, (removedHero) => {
            assert.equal(removedHero.heroName, hero.heroName);
            done();
        });
    });
});