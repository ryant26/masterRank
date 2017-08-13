let chai = require('chai');
let assert = chai.assert;
let randomString = require('randomstring');
let serverEvents = require('../../../src/socketEvents/serverEvents');
let clientEvents = require('../../../src/socketEvents/clientEvents');
let commonUtilities = require('../commonUtilities');

// Start the Socket Server
require('../../../src/app');

describe(serverEvents.groupLeave, function() {

    afterEach(function() {
        commonUtilities.closeOpenedSockets();
    });

    it('should remove the player from the group members', function(done) {
        commonUtilities.getFilledGroup(2).then((group) => {
            group.memberSockets[0].on(clientEvents.groupHeroLeft, (groupDetails) => {
                assert.lengthOf(groupDetails.members, 1);
                done();
            });

            group.memberSockets[1].emit(serverEvents.groupLeave);

        });
    });

    it('should promote a new leader when the leader leaves', function(done) {
        commonUtilities.getFilledGroup(1).then((group) => {
            group.leaderSocket.emit(serverEvents.groupLeave);

            let newLeader = group.memberHeros[0];
            group.memberSockets[0].on(clientEvents.groupPromotedLeader, (groupDetails) => {
                assert.equal(groupDetails.leader.battleNetId, newLeader.battleNetId);
                assert.equal(groupDetails.leader.heroName, newLeader.heroName);
                done();
            });
        });
    });

    it('should remove the newly promoted leader from the members', function(done) {
        commonUtilities.getFilledGroup(1).then((group) => {
            group.leaderSocket.emit(serverEvents.groupLeave);

            group.memberSockets[0].on(clientEvents.groupHeroLeft, (groupDetails) => {
                if (groupDetails.members.length === 0) {
                    done();
                }
            });
        });
    });

    it('should fire the groupHeroLeft event for the leader that left', function(done) {
        commonUtilities.getFilledGroup(1).then((group) => {
            group.leaderSocket.emit(serverEvents.groupLeave);

            let newLeader = group.memberHeros[0];
            group.memberSockets[0].on(clientEvents.groupHeroLeft, (groupDetails) => {
                if (groupDetails.leader.battleNetId === newLeader.battleNetId) {
                    done();
                }
            });
        });
    });

    it('should throw an error when the user is not in a group and tries to leave', function(done) {
        let socket2 = commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.connectionUrlUs);
        socket2.emit(serverEvents.groupLeave);

        socket2.on(clientEvents.error.groupLeave, (error) => {
            assert.equal(error.err, 'User is not in group');
            done();
        });
    });

    it('Should delete the group when the sole leader leaves', function(done) {
        commonUtilities.getEmptyGroup().then((details) => {
            details.leaderSocket.on(clientEvents.groupHeroLeft, (groupDetails) => {
                assert.isNull(groupDetails.leader);
                done();
            });

            details.leaderSocket.emit(serverEvents.groupLeave);
        });
    });
});