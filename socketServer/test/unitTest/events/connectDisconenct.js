const chai = require('chai');
const assert = chai.assert;
const randomString = require('randomstring');
const serverEvents = require('../../../../shared/libs/socketEvents/serverEvents');
const clientEvents = require('../../../../shared/libs/socketEvents/clientEvents');
const CommonUtilities = require('../CommonUtilities');
const redis = require('redis');
const config = require('config');

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
        return commonUtilities.closeOpenedSockets();
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

    after(function() {
        // The rate limiting test could potentially leave keys in the redis db, we'll clean it here
        let redisUrl = `redis://${config.get('redis.host')}:${config.get('redis.port')}`;
        let client = redis.createClient({
            url: redisUrl
        });
        return client.flushallAsync();
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

        socket.emit(serverEvents.addHero, 'tracer');
        socket.emit(serverEvents.addHero, 'winston');
        socket.emit(serverEvents.addHero, 'genji');

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

    it('should disconnect the socket when you send more than 50 requests in a minute', (done) => {
        let connected = true;

        socket.on('disconnect', () => {
            connected = false;
            done();
        });

        for (let i = 0; i < 51; i++) {
            if (connected) {
                socket.emit(serverEvents.addHero, {heroName: 'tracer', priority: 1});
            }
        }
    });

    it('should cancel any pending invites when your group is empty', function(done) {
        const invitee = 'someDisplayName';
        const heroName = 'tracer';
        commonUtilities.getEmptyGroup(commonUtilities.regions.us).then((data) => {
            commonUtilities.getUserWithAddedHero(invitee, heroName, commonUtilities.regions.us).then((data2) => {
                const leaderSocket = data.leaderSocket;
                const inviteeSocket = data2.socket;

                inviteeSocket.on(clientEvents.groupInviteCanceled, () => done());

                inviteeSocket.on(clientEvents.groupInviteReceived, () => {
                    leaderSocket.disconnect();
                });

                leaderSocket.emit(serverEvents.groupInviteSend, {platformDisplayName: invitee, heroName});
            });
        });
    });
});