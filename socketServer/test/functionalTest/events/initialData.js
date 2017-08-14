let chai = require('chai');
let assert = chai.assert;
let randomString = require('randomstring');
let serverEvents = require('../../../src/socketEvents/serverEvents');
let clientEvents = require('../../../src/socketEvents/clientEvents');
let commonUtilities = require('../commonUtilities');

let battleNetId = 'testUser#1234';

// Start the Socket Server
require('../../../src/app');

describe(clientEvents.initialData, function() {
    let socket;

    beforeEach(function () {
        socket = commonUtilities.getAuthenticatedSocket(battleNetId, commonUtilities.connectionUrlUs);
    });

    afterEach(function() {
        commonUtilities.closeOpenedSockets();
    });

    it('should return a list of all heros available for grouping', function(done) {
        let heroName = 'Soldier76';
        socket.emit(serverEvents.addHero, heroName);

        // Ensure hero is fully added before we connect the 2nd user
        socket.on(clientEvents.heroAdded, () => {
            let socket2 = commonUtilities.getAuthenticatedSocket('testUser2#1234', commonUtilities.connectionUrlUs);

            socket2.on(clientEvents.initialData, (data) => {
                assert.lengthOf(data, 1);
                assert.equal(data[0].heroName, heroName);
                done();
            });
        });
    });

    it('should not return heros from a different rank', function(done) {
        let heroName = 'Widowmaker';
        socket.emit(serverEvents.addHero, heroName);

        // Ensure hero is fully added before we connect the 2nd user
        setTimeout(function() {
            let socket2 = commonUtilities.getAuthenticatedSocket('goldPlayer#1234', commonUtilities.connectionUrlUs);

            socket2.on(clientEvents.initialData, (data) => {
                assert.isEmpty(data);
                done();
            });
        }, 50);
    });

    it('should not return heros from a different region', function(done) {
        let heroName = 'Widowmaker';
        socket.emit(serverEvents.addHero, heroName);

        // Ensure hero is fully added before we connect the 2nd user
        setTimeout(function() {
            let socket2 = commonUtilities.getAuthenticatedSocket('testUser2#1234', commonUtilities.connectionUrlEu);

            socket2.on(clientEvents.initialData, (data) => {
                assert.isEmpty(data);
                done();
            });
        }, 50);
    });

    it('should work in all regions', function() {
        let test = function(regionUrl) {
            return new Promise((resolve) => {
                let heroName = randomString.generate();

                let socket1 = commonUtilities.getAuthenticatedSocket(randomString.generate(), regionUrl);
                socket1.on(clientEvents.initialData, function () {
                    socket1.emit(serverEvents.addHero, heroName);
                });

                // Ensure hero is fully added before we connect the 2nd user
                setTimeout(function () {
                    let socket2 = commonUtilities.getAuthenticatedSocket('testUser3#1234', regionUrl);

                    socket2.on(clientEvents.initialData, (data) => {
                        assert.lengthOf(data, 1);
                        assert.equal(data[0].heroName, heroName);
                        return resolve();
                    });
                }, 50);
            });
        };

        return Promise.all([test(commonUtilities.connectionUrlUs), test(commonUtilities.connectionUrlEu), test(commonUtilities.connectionUrlAs)]);
    });
});