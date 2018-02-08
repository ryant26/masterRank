const chai = require('chai');
const assert = chai.assert;
const randomString = require('randomstring');
const serverEvents = require('../../../src/socketEvents/serverEvents');
const clientEvents = require('../../../src/socketEvents/clientEvents');
const CommonUtilities = require('../CommonUtilities');

let platformDisplayName;
let commonUtilities = new CommonUtilities();

// Start the Socket Server
require('../../../src/app');

describe('Connection', function() {
    let initialData;

    before(function () {
        platformDisplayName = randomString.generate();
        return commonUtilities.getAuthenticatedSocket(platformDisplayName, commonUtilities.regions.us).then((data) => {
            initialData = data.initialData;
        });
    });

    after(function() {
        commonUtilities.closeOpenedSockets();
    });

    it('should call initialData on the client upon connect', function(done) {
        assert.isArray(initialData);
        assert.isEmpty(initialData);
        done();
    });
});

describe('disconnect', function() {
    let socket;

    beforeEach(function () {
        return commonUtilities.getAuthenticatedSocket(platformDisplayName, commonUtilities.regions.us).then((data) => {
            socket = data.socket;
        });
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
            commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.regions.us).then(({initialData}) => {
                assert.isEmpty(initialData);
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

    it('should disconnect the socket when you send more than 25 requests in a minute', (done) => {
        socket.on('disconnect', () => done());

        for (let i = 0; i < 30; i++) {
            socket.emit(serverEvents.addHero, {heroName: 'tracer', priority: 1});
        }
    });
});