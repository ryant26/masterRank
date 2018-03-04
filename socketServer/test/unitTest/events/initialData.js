const chai = require('chai');
const assert = chai.assert;
const randomString = require('randomstring');
const serverEvents = require('../../../src/socketEvents/serverEvents');
const clientEvents = require('../../../src/socketEvents/clientEvents');
const CommonUtilities = require('../CommonUtilities');

let commonUtilities = new CommonUtilities();

let platformDisplayName = 'testUser#1234';

// Start the Socket Server
require('../../../src/app');

describe(clientEvents.initialData, function() {
    let socket;

    beforeEach(function () {
        return commonUtilities.getAuthenticatedSocket(platformDisplayName, commonUtilities.regions.us).then((data) => {
            socket = data.socket;
        });
    });

    afterEach(function() {
        return commonUtilities.closeOpenedSockets();
    });

    it('should return a list of all heros available for grouping', function(done) {
        let heroName = 'Soldier76';

        commonUtilities.getUserWithAddedHero(null, heroName).then((user) => {
            commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.regions.us).then((data) => {
                let hero = data.initialData.find((element) => {
                    return element.heroName === heroName && element.platformDisplayName === user.hero.platformDisplayName;
                });
                assert.isDefined(hero);
                done();
            });
        });
    });

    it('should not return heros from outside +/- 1 rank', function(done) {
        let heroName = 'Widowmaker';
        socket.emit(serverEvents.addHero, heroName);

        // Ensure hero is fully added before we connect the 2nd user
        setTimeout(function() {
            commonUtilities.getAuthenticatedSocket('goldPlayer#1234', commonUtilities.regions.us).then((data) => {
                assert.isEmpty(data.initialData);
                done();
            });
        }, 50);
    });

    it('should return heroes from all ranks when player is unranked themselves', function(done) {
        let heroName = 'Widowmaker';
        const addUser = function(name) {
            return commonUtilities.getUserWithAddedHero(name, heroName, commonUtilities.regions.us);
        };

        Promise.all([
            addUser('bronzePlayer#1234'),
            addUser('silverPlayer#1234'),
            addUser('goldPlayer#1234'),
            addUser('platinumPlayer#1234'),
            addUser('diamondPlayer#1234'),
            addUser('masterPlayer#1234'),
            addUser('grandmasterPlayer#1234'),
        ]).then(() => {
            return commonUtilities.getAuthenticatedSocket('unrankedPlayer#1234', commonUtilities.regions.us);
        }).then((unrankedPlayer) => {
            assert.lengthOf(unrankedPlayer.initialData, 7);
            done();
        });
    });

    it('should return heros from inside +/- 1 rank', function(done) {
        let heroName = 'Widowmaker';
        commonUtilities.getUserWithAddedHero('goldPlayer#1234', heroName, commonUtilities.regions.us).then(() => {
            commonUtilities.getAuthenticatedSocket('silverPlayer#1234', commonUtilities.regions.us).then((data2) => {
                assert.lengthOf(data2.initialData, 1);
                assert.equal(data2.initialData[0].heroName, heroName);
                done();
            });
        });
    });

    it('should not return heros from a different region', function(done) {
        let heroName = 'Widowmaker';
        socket.emit(serverEvents.addHero, heroName);

        // Ensure hero is fully added before we connect the 2nd user
        setTimeout(function() {
            commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.regions.eu).then((data) => {
                assert.isEmpty(data.initialData);
                done();
            });
        }, 50);
    });

    it('should work in all regions', function() {
        let test = function(region) {
            return new Promise((resolve) => {
                let heroName = 'genji';

                commonUtilities.getAuthenticatedSocket(randomString.generate(), region).then((data) => {
                    data.socket.emit(serverEvents.addHero, {heroName, priority: 2});
                });

                // Ensure hero is fully added before we connect the 2nd user
                setTimeout(function () {
                    commonUtilities.getAuthenticatedSocket(randomString.generate(), region).then((data) => {
                        assert.lengthOf(data.initialData, 1);
                        assert.equal(data.initialData[0].heroName, heroName);
                        return resolve();
                    });
                }, 50);
            });
        };

        return Promise.all([test(commonUtilities.regions.us), test(commonUtilities.regions.eu), test(commonUtilities.regions.as)]);
    });
});