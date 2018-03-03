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
        return commonUtilities.closeOpenedSockets();
    });

    it('should inform everyone that a new member was added', function(done) {
        let invitedHero = {
            platformDisplayName: randomString.generate(),
            heroName: 'tracer'
        };

        commonUtilities.getAuthenticatedSocket(invitedHero.platformDisplayName, commonUtilities.regions.us).then((data) => {
            let socket2 = data.socket;

            socket.on(clientEvents.heroAdded, () => {
                socket.emit(serverEvents.groupInviteSend, invitedHero);
            });

            socket2.on(clientEvents.groupInviteReceived, (groupDetails) => {
                socket2.emit(serverEvents.groupInviteAccept, groupDetails.groupId);
            });

            socket.on(clientEvents.groupInviteAccepted, (groupDetails) => {
                assert.equal(groupDetails.leader.platformDisplayName, leaderHero.platformDisplayName);
                assert.equal(groupDetails.leader.heroName, leaderHero.heroName);
                assert.lengthOf(groupDetails.pending, 0);
                assert.lengthOf(groupDetails.members, 1);
                assert.equal(groupDetails.members[0].heroName, invitedHero.heroName);
                assert.equal(groupDetails.members[0].platformDisplayName, invitedHero.platformDisplayName);
                done();
            });

            socket2.emit(serverEvents.addHero, {heroName: invitedHero.heroName, priority: 1});
        });
    });

    it('should only allow people in group pending to accept invites', function(done) {
        let invitedHero = {
            platformDisplayName: randomString.generate(),
            heroName: 'tracer'
        };

        socket.on(clientEvents.heroAdded, () => {
            socket.emit(serverEvents.groupInviteSend, invitedHero);
        });

        Promise.all([
            commonUtilities.getAuthenticatedSocket(invitedHero.platformDisplayName, commonUtilities.regions.us),
            commonUtilities.getAuthenticatedSocket(randomString.generate(), commonUtilities.regions.us)
        ]).then((sockets) => {
            let socket2 = sockets[0].socket;
            let socket3 = sockets[1].socket;

            // Make the uninvited socket accept the invite
            socket2.on(clientEvents.groupInviteReceived, (groupDetails) => {
                socket3.emit(serverEvents.groupInviteAccept, groupDetails.groupId);
            });

            socket3.on(clientEvents.error.groupInviteAccept, (error) => {
                assert.equal(error.err, 'Hero not invited to group');
                done();
            });

            socket2.emit(serverEvents.addHero, {heroName: invitedHero.heroName, priority: 1});

        });
    });

    xit('should add newest member to the back of group.members array', function(done) {
        let pendingHeroes = [
            {
                platformDisplayName: randomString.generate(),
                heroName: 'tracer'
            }, {
                platformDisplayName: randomString.generate(),
                heroName: 'genji'
            }, {
                platformDisplayName: randomString.generate(),
                heroName: 'winston'
            }
        ];

        socket.on(clientEvents.heroAdded, (invitedHero) => {
            socket.emit(serverEvents.groupInviteSend, invitedHero);
        });

        Promise.all([
            commonUtilities.getAuthenticatedSocket(pendingHeroes[0].platformDisplayName, commonUtilities.regions.us),
            commonUtilities.getAuthenticatedSocket(pendingHeroes[1].platformDisplayName, commonUtilities.regions.us),
            commonUtilities.getAuthenticatedSocket(pendingHeroes[2].platformDisplayName, commonUtilities.regions.us)
        ]).then((sockets) => {
            sockets.forEach((socket) => {
                let heroSocket = socket.socket;
                heroSocket.on(clientEvents.groupInviteReceived, (groupDetails) => {
                    heroSocket.emit(serverEvents.groupInviteAccept, groupDetails.groupId);
                });
            });


            socket.on(clientEvents.groupInviteAccepted, (groupDetails) => {
                if(groupDetails.members.length === 1){
                    assert.equal(groupDetails.members[0].heroName, pendingHeroes[0].heroName);
                } else if(groupDetails.members.length === 2){
                    assert.equal(groupDetails.members[1].heroName, pendingHeroes[1].heroName);
                } else if(groupDetails.members.length === 3){
                    assert.equal(groupDetails.members[2].heroName, pendingHeroes[2].heroName);
                    done();
                }
            });

            sockets.forEach((socket, i) => {
                let heroSocket = socket.socket;
                heroSocket.emit(serverEvents.addHero, {heroName: pendingHeroes[i].heroName, priority: 1});
            });
        });
    });

    it('should throw an exception for malformed groupID', function(done) {
        socket.on(clientEvents.error.groupInviteAccept, (error) => {
            assert.equal(error.err, exceptions.invalidGroupId);
            done();
        });

        socket.emit(serverEvents.groupInviteAccept, null);
    });
});