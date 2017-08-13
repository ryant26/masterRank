let chai = require('chai');
let assert = chai.assert;
let randomString = require('randomstring');
let serverEvents = require('../../../src/socketEvents/serverEvents');
let clientEvents = require('../../../src/socketEvents/clientEvents');
let commonUtilities = require('../commonUtilities');

// Start the Socket Server
require('../../../src/app');

describe(serverEvents.groupInviteSend, function() {
    let socket;
    let leaderHero;

    beforeEach(function() {
        return commonUtilities.getEmptyGroup().then((groupDetails) => {
            socket = groupDetails.leaderSocket;
            leaderHero = groupDetails.leaderHero;
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

        commonUtilities.getUserWithAddedHero(invitedHero.battleNetId, invitedHero.heroName).then((user) => {
            user.socket.on(clientEvents.groupInviteReceived, (groupDetails) => {
                assert.equal(groupDetails.leader.battleNetId, leaderHero.battleNetId);
                assert.equal(groupDetails.leader.heroName, leaderHero.heroName);
                assert.lengthOf(groupDetails.pending, 1);
                assert.lengthOf(groupDetails.members, 0);
                done();
            });

            socket.emit(serverEvents.groupInviteSend, invitedHero);
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