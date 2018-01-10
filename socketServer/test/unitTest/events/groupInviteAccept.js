const chai = require('chai');
const assert = chai.assert;
const randomString = require('randomstring');
const serverEvents = require('../../../src/socketEvents/serverEvents');
const clientEvents = require('../../../src/socketEvents/clientEvents');
const CommonUtilities = require('../CommonUtilities');
const exceptions = require('../../../src/validators/exceptions/exceptions');

let commonUtilities = new CommonUtilities();

// Start the Socket Server
require('../../../src/app');

describe(serverEvents.groupInviteAccept, function() {
    let socket;
    let leaderHero;

    beforeEach(function() {
        return commonUtilities.getEmptyGroup().then((group) => {
            socket = group.leaderSocket;
            leaderHero = group.leaderHero;
        });
    });

    afterEach(function() {
        commonUtilities.closeOpenedSockets();

    });

    it('should inform everyone that a new member was added', function(done) {
        let invitedHero = {
            platformDisplayName: randomString.generate(),
            heroName: randomString.generate()
        };

        commonUtilities.getAuthenticatedSocket(invitedHero.platformDisplayName, commonUtilities.regions.us).then((data) => {
            let socket2 = data.socket;

            socket.on(clientEvents.heroAdded, () => {
                socket.emit(serverEvents.groupInviteSend, invitedHero);
            });

            socket2.on(clientEvents.groupInviteReceived, (groupDetails) => {
                socket2.emit(serverEvents.groupInviteAccept, groupDetails.groupId);
            });

            socket.on(clientEvents.groupInviteAccepted, (groupDetails) => {
                assert.equal(groupDetails.leader.platformDisplayName, leaderHero.platformDisplayName);
                assert.equal(groupDetails.leader.heroName, leaderHero.heroName);
                assert.lengthOf(groupDetails.pending, 0);
                assert.lengthOf(groupDetails.members, 1);
                assert.equal(groupDetails.members[0].heroName, invitedHero.heroName);
                assert.equal(groupDetails.members[0].platformDisplayName, invitedHero.platformDisplayName);
                done();
            });

            socket2.emit(serverEvents.addHero, {heroName: invitedHero.heroName, priority: 1});
        });
    });

    it('should only allow people in group pending to accept invites', function(done) {
        let invitedHero = {
            platformDisplayName: randomString.generate(),
            heroName: randomString.generate()
        };

        socket.on(clientEvents.heroAdded, () => {
            socket.emit(serverEvents.groupInviteSend, invitedHero);
        });

        Promise.all([
            commonUtilities.getAuthenticatedSocket(invitedHero.platformDisplayName, commonUtilities.regions.us),
            commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.regions.us)
        ]).then((sockets) => {
            let socket2 = sockets[0].socket;
            let socket3 = sockets[1].socket;

            // Make the uninvited socket accept the invite
            socket2.on(clientEvents.groupInviteReceived, (groupDetails) => {
                socket3.emit(serverEvents.groupInviteAccept, groupDetails.groupId);
            });

            socket3.on(clientEvents.error.groupInviteAccept, (error) => {
                assert.equal(error.err, 'Hero not invited to group');
                done();
            });

            socket2.emit(serverEvents.addHero, {heroName: invitedHero.heroName, priority: 1});

        });
    });

    it('should fire the heroRemoved event to the rank', function(done) {
        let invitedHero = {
            platformDisplayName: randomString.generate(),
            heroName: randomString.generate()
        };

        socket.on(clientEvents.heroRemoved, (hero) => {
            assert.equal(hero.heroName, invitedHero.heroName);
            assert.equal(hero.platformDisplayName, invitedHero.platformDisplayName);
            done();
        });

        commonUtilities.getAuthenticatedSocket(invitedHero.platformDisplayName, commonUtilities.regions.us).then((data) => {
            let socket2 = data.socket;

            socket.on(clientEvents.heroAdded, () => {
                socket.emit(serverEvents.groupInviteSend, invitedHero);
            });

            socket2.on(clientEvents.groupInviteReceived, (groupDetails) => {
                socket2.emit(serverEvents.groupInviteAccept, groupDetails.groupId);
            });

            socket2.emit(serverEvents.addHero, {heroName: invitedHero.heroName, priority: 1});
        });
    });

    it('should throw an exception for malformed groupID', function(done) {
        socket.on(clientEvents.error.groupInviteAccept, (error) => {
            assert.equal(error.err, exceptions.invalidGroupId);
            done();
        });

        socket.emit(serverEvents.groupInviteAccept, null);
    });
});