const chai = require('chai');
const assert = chai.assert;
const randomString = require('randomstring');
const serverEvents = require('../../../src/socketEvents/serverEvents');
const clientEvents = require('../../../src/socketEvents/clientEvents');
const CommonUtilities = require('../CommonUtilities');

let commonUtilities = new CommonUtilities();

let battleNetId = 'testUser#1234';

// Start the Socket Server
require('../../../src/app');

describe(clientEvents.initialData, function() {
    let socket;

    beforeEach(function () {
        commonUtilities.mockPlayerApi();
        socket = commonUtilities.getAuthenticatedSocket(battleNetId, commonUtilities.regions.us);
    });

    afterEach(function() {
        commonUtilities.closeOpenedSockets();
        commonUtilities.restorePlayerApi();
    });

    it('should return a list of all heros available for grouping', function(done) {
        let heroName = 'Soldier76';

        commonUtilities.getUserWithAddedHero(null, heroName).then((user) => {
            let socket2 = commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.regions.us);

            socket2.on(clientEvents.initialData, (data) => {
                let hero = data.find((element) => {
                    return element.heroName === heroName && element.battleNetId === user.hero.battleNetId;
                });
                assert.isDefined(hero);
                done();
            });
        });
    });

    it('should not return heros from a different rank', function(done) {
        let heroName = 'Widowmaker';
        socket.emit(serverEvents.addHero, heroName);

        // Ensure hero is fully added before we connect the 2nd user
        setTimeout(function() {
            let socket2 = commonUtilities.getAuthenticatedSocket('goldPlayer#1234', commonUtilities.regions.us);

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
            let socket2 = commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.regions.eu);

            socket2.on(clientEvents.initialData, (data) => {
                assert.isEmpty(data);
                done();
            });
        }, 50);
    });

    it('should work in all regions', function() {
        let test = function(region) {
            return new Promise((resolve) => {
                let heroName = randomString.generate();

                let socket1 = commonUtilities.getAuthenticatedSocket(randomString.generate(), region);
                socket1.on(clientEvents.initialData, function () {
                    socket1.emit(serverEvents.addHero, heroName);
                });

                // Ensure hero is fully added before we connect the 2nd user
                setTimeout(function () {
                    let socket2 = commonUtilities.getAuthenticatedSocket(randomString.generate(), region);

                    socket2.on(clientEvents.initialData, (data) => {
                        assert.lengthOf(data, 1);
                        assert.equal(data[0].heroName, heroName);
                        return resolve();
                    });
                }, 50);
            });
        };

        return Promise.all([test(commonUtilities.regions.us), test(commonUtilities.regions.eu), test(commonUtilities.regions.as)]);
    });
});