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

describe(serverEvents.groupInviteCancel, function() {
    let socket;

    beforeEach(function() {
        return commonUtilities.getEmptyGroup().then((groupDetails) => {
            socket = groupDetails.leaderSocket;
        });
    });

    afterEach(function() {
        return commonUtilities.closeOpenedSockets();
    });

    describe('should emit both playerInviteCanceled and groupInviteCanceled', () => {
        it('Should remove a pending hero', function(done) {
            let invitedHero = {
                platformDisplayName: randomString.generate(),
                heroName: 'genji'
            };

            socket.on(clientEvents.groupInviteCanceled, (details) => {
                assert.lengthOf(details.pending, 0);
                done();
            });
            //TODO: Add test against what is passed to socket.to() and namespace.to() eliminate these types of errors.
            socket.on(clientEvents.playerInviteCanceled, (details) => {
                assert.lengthOf(details.pending, 0);
                done();
            });

            commonUtilities.getUserWithAddedHero(invitedHero.platformDisplayName, invitedHero.heroName).then((user) => {
                user.socket.on(clientEvents.groupInviteReceived, () => {
                    socket.emit(serverEvents.groupInviteCancel, invitedHero);
                });

                socket.emit(serverEvents.groupInviteSend, invitedHero);
            });
        });

        it('should not allow non-leaders to perform cancels', function(done) {
            commonUtilities.getFilledGroup(2).then((groupSockets) => {
                let memberSocket = groupSockets.memberSockets[0];

                memberSocket.on(clientEvents.error.groupInviteCancel, (error) => {
                    assert.equal(error.err, 'Unauthorized');
                    done();
                });

                memberSocket.on(clientEvents.playerInvited, (details) => {
                    memberSocket.emit(serverEvents.groupInviteCancel, details.pending[0]);
                });

                commonUtilities.getUserWithAddedHero().then((user) => {
                    groupSockets.leaderSocket.emit(serverEvents.groupInviteSend, user.hero);
                });
            });
        });

        it('should not fire event for inviting non-existant hero', function(done) {
            let invite = {
                platformDisplayName: randomString.generate(),
                heroName: 'genji'
            };

            socket.emit(serverEvents.groupInviteCancel, invite);

            socket.on(clientEvents.error.groupInviteCancel, (error) => {
                assert.equal(error.err, 'Hero not invited to group');
                done();
            });
        });

        it('should reject malformed platformDisplayName', function(done) {
            socket.on(clientEvents.error.groupInviteCancel, (error) => {
                assert.equal(error.err, exceptions.malformedHeroObject);
                done();
            });

            socket.emit(serverEvents.groupInviteCancel, {
                platformDisplayName: 0,
                heroName: 'hanzo'
            });
        });

        it('should reject malformed heroName', function(done) {
            socket.emit(serverEvents.groupInviteCancel, {
                platformDisplayName: randomString.generate(),
                heroName: 10
            });

            socket.on(clientEvents.error.groupInviteCancel, (error) => {
                assert.equal(error.err, exceptions.invalidHeroName);
                done();
            });
        });
    });
});