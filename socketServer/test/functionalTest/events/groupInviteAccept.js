let chai = require('chai');
let assert = chai.assert;
let randomString = require('randomstring');
let serverEvents = require('../../../src/socketEvents/serverEvents');
let clientEvents = require('../../../src/socketEvents/clientEvents');
let commonUtilities = require('../commonUtilities');

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
            battleNetId: randomString.generate(),
            heroName: randomString.generate()
        };

        let socket2 = commonUtilities.getAuthenticatedSocket(invitedHero.battleNetId, commonUtilities.connectionUrlUs);

        socket.on(clientEvents.heroAdded, () => {
            socket.emit(serverEvents.groupInviteSend, invitedHero);
        });

        socket2.on(clientEvents.initialData, () => {
            socket2.emit(serverEvents.addHero, invitedHero.heroName);
        });

        socket2.on(clientEvents.groupInviteReceived, (groupDetails) => {
            socket2.emit(serverEvents.groupInviteAccept, groupDetails.groupId);
        });

        socket.on(clientEvents.groupInviteAccepted, (groupDetails) => {
            assert.equal(groupDetails.leader.battleNetId, leaderHero.battleNetId);
            assert.equal(groupDetails.leader.heroName, leaderHero.heroName);
            assert.lengthOf(groupDetails.pending, 0);
            assert.lengthOf(groupDetails.members, 1);
            assert.equal(groupDetails.members[0].heroName, invitedHero.heroName);
            assert.equal(groupDetails.members[0].battleNetId, invitedHero.battleNetId);
            done();
        });
    });

    it('should only allow people in group pending to accept invites', function(done) {
        let invitedHero = {
            battleNetId: randomString.generate(),
            heroName: randomString.generate()
        };

        let socket2 = commonUtilities.getAuthenticatedSocket(invitedHero.battleNetId, commonUtilities.connectionUrlUs);
        let socket3 = commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.connectionUrlUs);

        socket2.on(clientEvents.initialData, () => {
            socket2.emit(serverEvents.addHero, invitedHero.heroName);
        });

        socket.on(clientEvents.heroAdded, () => {
            socket.emit(serverEvents.groupInviteSend, invitedHero);
        });

        // Make the uninvited socket accept the invite
        socket2.on(clientEvents.groupInviteReceived, (groupDetails) => {
            socket3.emit(serverEvents.groupInviteAccept, groupDetails.groupId);
        });

        socket3.on(clientEvents.error.groupInviteAccept, (error) => {
            assert.equal(error.err, 'Hero not invited to group');
            done();
        });
    });

    it('should fire the heroRemoved event to the rank', function(done) {
        let invitedHero = {
            battleNetId: randomString.generate(),
            heroName: randomString.generate()
        };

        socket.on(clientEvents.heroRemoved, (hero) => {
            assert.equal(hero.heroName, invitedHero.heroName);
            assert.equal(hero.battleNetId, invitedHero.battleNetId);
            done();
        });

        let socket2 = commonUtilities.getAuthenticatedSocket(invitedHero.battleNetId, commonUtilities.connectionUrlUs);

        socket2.on(clientEvents.initialData, () => {
            socket2.emit(serverEvents.addHero, invitedHero.heroName);
        });

        socket.on(clientEvents.heroAdded, () => {
            socket.emit(serverEvents.groupInviteSend, invitedHero);
        });

        socket2.on(clientEvents.groupInviteReceived, (groupDetails) => {
            socket2.emit(serverEvents.groupInviteAccept, groupDetails.groupId);
        });
    });
});