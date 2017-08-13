let chai = require('chai');
let assert = chai.assert;
let randomString = require('randomstring');
let serverEvents = require('../../../src/socketEvents/serverEvents');
let clientEvents = require('../../../src/socketEvents/clientEvents');
let commonUtilities = require('../commonUtilities');

// Start the Socket Server
require('../../../src/app');

let battleNetId = 'testUser#1234';

describe(serverEvents.groupInviteSend, function() {
    let socket;
    let leaderHero;

    beforeEach(function() {
        return new Promise((resolve) => {
            socket = commonUtilities.getAuthenticatedSocket(battleNetId, commonUtilities.connectionUrlUs);
            leaderHero = {
                battleNetId: battleNetId,
                heroName: randomString.generate()
            };
            socket.emit(serverEvents.createGroup, leaderHero);
            socket.on(clientEvents.groupPromotedLeader, (details) => {
                socket.removeAllListeners(clientEvents.groupPromotedLeader);
                resolve(details);
            });
        });
    });

    afterEach(function() {
        commonUtilities.closeOpenedSockets();
    });

    it('Should show group details on invite', function(done) {
        let invitedHero = {
            battleNetId: randomString.generate(),
            heroName: randomString.generate()
        };

        let socket2 = commonUtilities.getAuthenticatedSocket(invitedHero.battleNetId, commonUtilities.connectionUrlUs);

        socket2.on(clientEvents.initialData, () => {
            socket2.emit(serverEvents.addHero, invitedHero.heroName);
        });

        socket.on(clientEvents.heroAdded, () => {
            socket.emit(serverEvents.groupInviteSend, invitedHero);
        });

        socket2.on(clientEvents.groupInviteReceived, (groupDetails) => {
            assert.equal(groupDetails.leader.battleNetId, leaderHero.battleNetId);
            assert.equal(groupDetails.leader.heroName, leaderHero.heroName);
            assert.lengthOf(groupDetails.pending, 1);
            assert.lengthOf(groupDetails.members, 0);
            done();
        });
    });

    it('should not allow non-leaders to perform invites', function(done) {
        commonUtilities.getFilledGroup(2).then((groupSockets) => {
            let invite = {
                battleNetId: randomString.generate(),
                heroName: randomString.generate()
            };

            let memberSocket = groupSockets.memberSockets[0];

            let inviteSocket = commonUtilities.getAuthenticatedSocket(invite.battleNetId, commonUtilities.connectionUrlUs);

            inviteSocket.on(clientEvents.initialData, () => {
                inviteSocket.emit(serverEvents.addHero, invite.heroName);
            });

            memberSocket.on(clientEvents.heroAdded, (hero) => {
                if (hero.battleNetId === invite.battleNetId) {
                    memberSocket.emit(serverEvents.groupInviteSend, invite);
                }
            });

            memberSocket.on(clientEvents.error.groupInviteSend, (error) => {
                assert.equal(error.err, 'Unauthorized');
                done();
            });
        });
    });

    it('should not fire event for inviting non-existant hero', function(done) {
        let invite = {
            battleNetId: randomString.generate(),
            heroName: randomString.generate()
        };

        socket.emit(serverEvents.groupInviteSend, invite);

        socket.on(clientEvents.error.groupInviteSend, (error) => {
            assert.equal(error.err, 'Hero not found');
            done();
        });
    });
});