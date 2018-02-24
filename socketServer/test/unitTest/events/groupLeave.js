const chai = require('chai');
const assert = chai.assert;
const serverEvents = require('../../../src/socketEvents/serverEvents');
const clientEvents = require('../../../src/socketEvents/clientEvents');
const CommonUtilities = require('../CommonUtilities');

let commonUtilities = new CommonUtilities();

// Start the Socket Server
require('../../../src/app');

describe(serverEvents.groupLeave, function() {

    afterEach(function() {
        return commonUtilities.closeOpenedSockets();
    });

    it('should remove the player from the leader\'s group', function(done) {
        commonUtilities.getFilledGroup(2).then((group) => {
            group.leaderSocket.on(clientEvents.playerHeroLeft, (groupDetails) => {
                assert.lengthOf(groupDetails.members, 1);
                done();
            });

            group.memberSockets[1].emit(serverEvents.groupLeave);
        });
    });

    it('should remove the player from other group members\' group', function(done) {
        commonUtilities.getFilledGroup(2).then((group) => {
            group.memberSockets[0].on(clientEvents.playerHeroLeft, (groupDetails) => {
                assert.lengthOf(groupDetails.members, 1);
                done();
            });

            group.memberSockets[1].emit(serverEvents.groupLeave);
        });
    });

    it('should promote a new leader when the leader leaves', function(done) {
        commonUtilities.getFilledGroup(1).then((group) => {
            let newLeader = group.memberHeros[0];

            group.memberSockets[0].on(clientEvents.groupPromotedLeader, (groupDetails) => {
                assert.equal(groupDetails.leader.platformDisplayName, newLeader.platformDisplayName);
                assert.equal(groupDetails.leader.heroName, newLeader.heroName);
                done();
            });

            group.leaderSocket.emit(serverEvents.groupLeave);

        });
    });

    it('should remove the newly promoted leader from the members', function(done) {
        commonUtilities.getFilledGroup(1).then((group) => {
            group.memberSockets[0].on(clientEvents.playerHeroLeft, (groupDetails) => {
                if (groupDetails.members.length === 0) {
                    done();
                }
            });

            group.leaderSocket.emit(serverEvents.groupLeave);
        });
    });

    it('should fire the playerHeroLeft event for the leader that left', function(done) {
        commonUtilities.getFilledGroup(1).then((group) => {
            let newLeader = group.memberHeros[0];
            group.memberSockets[0].on(clientEvents.playerHeroLeft, (groupDetails) => {
                if (groupDetails.leader.platformDisplayName === newLeader.platformDisplayName) {
                    done();
                }
            });

            group.leaderSocket.emit(serverEvents.groupLeave);
        });
    });

    it('should throw an error when the user is not in a group and tries to leave', function(done) {
        commonUtilities.getUserWithAddedHero().then((user) => {
            user.socket.on(clientEvents.error.groupLeave, (error) => {
                assert.equal(error.err, 'User is not in group');
                done();
            });

            user.socket.emit(serverEvents.groupLeave);
        });
    });

    it('Should delete the group when the sole leader leaves', function(done) {
        commonUtilities.getEmptyGroup().then((details) => {
            details.leaderSocket.on(clientEvents.playerHeroLeft, (groupDetails) => {
                assert.isNull(groupDetails.leader);
                done();
            });

            details.leaderSocket.emit(serverEvents.groupLeave);
        });
    });

    it('should cancel group invites when the last player leaves', function(done) {
        let groupDetails;
        commonUtilities.getEmptyGroup().then((details) => {
            groupDetails = details;
            return commonUtilities.getUserWithAddedHero();
        }).then((user) => {
            user.socket.on(clientEvents.groupInviteCanceled, () => {
                done();
            });

            groupDetails.leaderSocket.on(clientEvents.playerInvited, () => {
                groupDetails.leaderSocket.emit(serverEvents.groupLeave);
            });

            groupDetails.leaderSocket.emit(serverEvents.groupInviteSend, user.hero);
        });
    });
});