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
        return commonUtilities.closeOpenedSockets();

    });

    it('Should show group details on invite', function(done) {
        let invitedHero = {
            platformDisplayName: randomString.generate(),
            heroName: 'mei'
        };

        commonUtilities.getUserWithAddedHero(invitedHero.platformDisplayName, invitedHero.heroName).then((user) => {
            user.socket.on(clientEvents.groupInviteReceived, (groupDetails) => {
                assert.equal(groupDetails.leader.platformDisplayName, leaderHero.platformDisplayName);
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
                platformDisplayName: randomString.generate(),
                heroName: 'winston'
            };

            let memberSocket = groupSockets.memberSockets[0];

            memberSocket.on(clientEvents.heroAdded, (hero) => {
                if (hero.platformDisplayName === invite.platformDisplayName) {
                    memberSocket.emit(serverEvents.groupInviteSend, invite);
                }
            });

            memberSocket.on(clientEvents.error.groupInviteSend, (error) => {
                assert.equal(error.err, 'Unauthorized');
                done();
            });

            commonUtilities.getAuthenticatedSocket(invite.platformDisplayName, commonUtilities.regions.us).then((data) => {
                data.socket.emit(serverEvents.addHero, {heroName: invite.heroName, priority: 1});
            });
        });
    });

    it('should not fire event for inviting non-existant hero', function(done) {
        let invite = {
            platformDisplayName: randomString.generate(),
            heroName: 'mei'
        };

        socket.emit(serverEvents.groupInviteSend, invite);

        socket.on(clientEvents.error.groupInviteSend, (error) => {
            assert.equal(error.err, 'Hero not found');
            done();
        });
    });

    it('should reject malformed platformDisplayName', function(done) {
        socket.emit(serverEvents.groupInviteSend, {
            platformDisplayName: 0,
            heroName: 'hanzo'
        });

        socket.on(clientEvents.error.groupInviteSend, (error) => {
            assert.equal(error.err, exceptions.malformedHeroObject);
            done();
        });
    });

    it('should reject malformed heroName', function(done) {
        socket.emit(serverEvents.groupInviteSend, {
            platformDisplayName: randomString.generate(),
            heroName: 10
        });

        socket.on(clientEvents.error.groupInviteSend, (error) => {
            assert.equal(error.err, exceptions.invalidHeroName);
            done();
        });
    });
});