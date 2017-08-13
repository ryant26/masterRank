let chai = require('chai');
let assert = chai.assert;
let serverEvents = require('../../../src/socketEvents/serverEvents');
let clientEvents = require('../../../src/socketEvents/clientEvents');
let commonUtilities = require('../commonUtilities');
let exceptions = require('../../../src/validators/exceptions/exceptions');

// Start the Socket Server
require('../../../src/app');

describe(serverEvents.groupInviteDecline, function() {

    afterEach(function() {
        commonUtilities.closeOpenedSockets();
    });

    it('should inform everyone that an invite was declined', function(done) {
        let groupDetails;
        commonUtilities.getFilledGroup(2).then((details) => {
            groupDetails = details;
            details.memberSockets[1].on(clientEvents.groupInviteDeclined, (declineDetails) => {
                assert.lengthOf(declineDetails.pending, 0);
                done();
            });

            return commonUtilities.getUserWithAddedHero();
        }).then((user) => {
            user.socket.on(clientEvents.groupInviteReceived, (inviteDetails) => {
                user.socket.emit(serverEvents.groupInviteDecline, inviteDetails.groupId);
            });

            groupDetails.leaderSocket.emit(serverEvents.groupInviteSend, user.hero);
        });
    });

    it('should only allow people in group pending to decline invites', function(done) {
        let groupId = 10;
        commonUtilities.getUserWithAddedHero().then((user) => {
            user.socket.on(clientEvents.error.groupInviteDecline, (error) => {
                assert.equal(error.err, exceptions.heroNotInvitedToGroup);
                assert.equal(error.groupId, groupId);
                done();
            });

            user.socket.emit(serverEvents.groupInviteDecline, groupId);
        });
    });
});