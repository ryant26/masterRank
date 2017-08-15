let chai = require('chai');
let assert = chai.assert;
let randomString = require('randomstring');
let serverEvents = require('../../../src/socketEvents/serverEvents');
let clientEvents = require('../../../src/socketEvents/clientEvents');
let commonUtilities = require('../commonUtilities');
let exceptions = require('../../../src/validators/exceptions/exceptions');

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
        commonUtilities.closeOpenedSockets();
    });

    it('Should remove a pending hero', function(done) {
        let invitedHero = {
            battleNetId: randomString.generate(),
            heroName: randomString.generate()
        };

        socket.on(clientEvents.groupInviteCanceled, (details) => {
            assert.lengthOf(details.pending, 0);
            done();
        });

        commonUtilities.getUserWithAddedHero(invitedHero.battleNetId, invitedHero.heroName).then((user) => {
            user.socket.on(clientEvents.groupInviteReceived, () => {
                socket.emit(serverEvents.groupInviteCancel, invitedHero);
            });

            socket.emit(serverEvents.groupInviteSend, invitedHero);
        });
    });

    it('should not allow non-leaders to perform cancels', function(done) {
        commonUtilities.getFilledGroup(2).then((groupSockets) => {
            let memberSocket = groupSockets.memberSockets[0];

            memberSocket.on(clientEvents.playerInvited, (details) => {
                memberSocket.emit(serverEvents.groupInviteCancel, details.pending[0]);
            });

            memberSocket.on(clientEvents.error.groupInviteCancel, (error) => {
                assert.equal(error.err, 'Unauthorized');
                done();
            });

            commonUtilities.getUserWithAddedHero().then((user) => {
                groupSockets.leaderSocket.emit(serverEvents.groupInviteSend, user.hero);
            });
        });
    });

    it('should not fire event for inviting non-existant hero', function(done) {
        let invite = {
            battleNetId: randomString.generate(),
            heroName: randomString.generate()
        };

        socket.emit(serverEvents.groupInviteCancel, invite);

        socket.on(clientEvents.error.groupInviteCancel, (error) => {
            assert.equal(error.err, 'Hero not invited to group');
            done();
        });
    });

    it('should reject malformed battleNetId', function(done) {
        socket.emit(serverEvents.groupInviteCancel, {
            battleNetId: 0,
            heroName: 'hanzo'
        });

        socket.on(clientEvents.error.groupInviteCancel, (error) => {
            assert.equal(error.err, exceptions.malformedHeroObject);
            done();
        });
    });

    it('should reject malformed heroName', function(done) {
        socket.emit(serverEvents.groupInviteCancel, {
            battleNetId: 'testing#1234',
            heroName: 10
        });

        socket.on(clientEvents.error.groupInviteCancel, (error) => {
            assert.equal(error.err, exceptions.invalidHeroName);
            done();
        });
    });
});