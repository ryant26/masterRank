const chai = require('chai');
const assert = chai.assert;
const serverEvents = require('../../../src/socketEvents/serverEvents');
const clientEvents = require('../../../src/socketEvents/clientEvents');
const CommonUtilities = require('../commonUtilities');
const exceptions = require('../../../src/validators/exceptions/exceptions');

let commonUtilities = new CommonUtilities();

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

    it('should throw an exception for malformed groupID', function(done) {
        commonUtilities.getUserWithAddedHero().then((user) => {
            user.socket.on(clientEvents.error.groupInviteDecline, (error) => {
                assert.equal(error.err, exceptions.invalidGroupId);
                done();
            });

            user.socket.emit(serverEvents.groupInviteDecline, null);
        });
    });
});