let chai = require('chai');
let assert = chai.assert;
let io = require('socket.io-client');
let config = require('config');
let randomString = require('randomstring');
let serverEvents = require('../../src/socketEvents/serverEvents');
let clientEvents = require('../../src/socketEvents/clientEvents');

// Start the Socket Server
require('../../src/app');

let connectionUrl = `${config.get('url')}:${config.get('port')}`;
let connectionUrlUs = `${connectionUrl}/us`;
let connectionUrlEu = `${connectionUrl}/eu`;
let connectionUrlAs = `${connectionUrl}/as`;

let battleNetId = 'testUser#1234';

let getAuthenticatedSocket = function (battleNetId, socketUrl) {
    let outSocket = io(socketUrl, {forceNew: true});
    outSocket.emit('authenticate', {battleNetId: battleNetId});
    return outSocket;
};

let getFilledGroup = function (numberOfGroupMembers) {
    let out = {
        memberSockets: []
    };

    out.leaderSocket = getAuthenticatedSocket(battleNetId, connectionUrlUs);

    out.leaderHero = {
        battleNetId: randomString.generate(),
        heroName: randomString.generate()
    };

    out.leaderSocket.emit(serverEvents.createGroup, out.leaderHero);

    out.leaderSocket.on(clientEvents.heroAdded, (hero) => {
        out.leaderSocket.emit(serverEvents.groupInviteSend, hero);
    });

    for (let i = 0; i < numberOfGroupMembers; i++) {
        let member = {
            battleNetId: randomString.generate(),
            heroName: randomString.generate()
        };


        let memberSocket = getAuthenticatedSocket(member.battleNetId, connectionUrlUs);

        memberSocket.on(clientEvents.initialData, () => {
            memberSocket.emit(serverEvents.addHero, member.heroName);
        });

        memberSocket.on(clientEvents.groupInviteReceived, (group) => {
            memberSocket.emit(serverEvents.groupInviteAccept, group.groupId);
            memberSocket.removeAllListeners(clientEvents.groupInviteReceived);
            memberSocket.removeAllListeners(clientEvents.initialData);
        });

        out.memberSockets.push(memberSocket);
    }

    return new Promise((resolve) => {
        setTimeout(() => {
            out.leaderSocket.removeAllListeners(clientEvents.heroAdded);
            resolve(out);
        }, 200);
    });
};

describe('Connection', function() {
    let socket;

    before(function () {
        socket = getAuthenticatedSocket(battleNetId, connectionUrlUs);
    });

    after(function() {
        socket.close();
    });

    it('should call initialData on the client upon connect', function(done) {
        socket.on(clientEvents.initialData, (data) => {
            assert.isArray(data);
            assert.isEmpty(data);
            done();
        });
    });
});

describe('disconnect', function() {
    let socket;

    beforeEach(function () {
        socket = getAuthenticatedSocket(battleNetId, connectionUrlUs);
    });

    afterEach(function() {
        socket.close();
    });

    it('should remove all heros from the meta list', function(done) {
        socket.emit(serverEvents.addHero, randomString.generate());
        socket.emit(serverEvents.addHero, randomString.generate());
        socket.emit(serverEvents.addHero, randomString.generate());

        setTimeout(function() {
            socket.close();
        }, 50);

        // Ensure hero is fully added before we connect the 2nd user
        setTimeout(function() {
            let socket2 = getAuthenticatedSocket('testUser2#1234', connectionUrlUs);

            socket2.on(clientEvents.initialData, (data) => {
                assert.isEmpty(data);
                socket2.close();
                done();
            });
        }, 100);
    });

    it('should call the removeHero event when a hero is removed', function(done) {
        let heroName = randomString.generate();
        socket.emit(serverEvents.addHero, heroName);

        let socket2 = getAuthenticatedSocket('testUser2#1234', connectionUrlUs);


        socket2.on('heroRemoved', (hero) => {
            assert.equal(hero.heroName, heroName);
            socket2.close();
            done();
        });

        setTimeout(function() {
            socket.close();
        }, 50);

    });
});

describe('initalData', function() {
    let socket;

    beforeEach(function () {
        socket = getAuthenticatedSocket(battleNetId, connectionUrlUs);
    });

    afterEach(function() {
        socket.close();
    });

    it('should return a list of all heros available for grouping', function(done) {
        let heroName = 'Soldier76';
        socket.emit(serverEvents.addHero, heroName);

        // Ensure hero is fully added before we connect the 2nd user
        setTimeout(function() {
            let socket2 = getAuthenticatedSocket('testUser2#1234', connectionUrlUs);

            socket2.on(clientEvents.initialData, (data) => {
                assert.lengthOf(data, 1);
                assert.equal(data[0].heroName, heroName);
                socket2.close();
                done();
            });
        }, 50);
    });

    it('should not return heros from a different rank', function(done) {
        let heroName = 'Widowmaker';
        socket.emit(serverEvents.addHero, heroName);

        // Ensure hero is fully added before we connect the 2nd user
        setTimeout(function() {
            let socket2 = getAuthenticatedSocket('goldPlayer#1234', connectionUrlUs);

            socket2.on(clientEvents.initialData, (data) => {
                assert.isEmpty(data);
                socket2.close();
                done();
            });
        }, 50);
    });

    it('should not return heros from a different region', function(done) {
        let heroName = 'Widowmaker';
        socket.emit(serverEvents.addHero, heroName);

        // Ensure hero is fully added before we connect the 2nd user
        setTimeout(function() {
            let socket2 = getAuthenticatedSocket('testUser2#1234', connectionUrlEu);

            socket2.on(clientEvents.initialData, (data) => {
                assert.isEmpty(data);
                socket2.close();
                done();
            });
        }, 50);
    });

    it('should work in all regions', function() {
        let test = function(regionUrl) {
            return new Promise((resolve) => {
                let heroName = randomString.generate();

                let socket1 = getAuthenticatedSocket(randomString.generate(), regionUrl);
                socket1.on(clientEvents.initialData, function () {
                    socket1.emit(serverEvents.addHero, heroName);
                });

                // Ensure hero is fully added before we connect the 2nd user
                setTimeout(function () {
                    let socket2 = getAuthenticatedSocket('testUser3#1234', regionUrl);

                    socket2.on(clientEvents.initialData, (data) => {
                        assert.lengthOf(data, 1);
                        assert.equal(data[0].heroName, heroName);
                        socket1.close();
                        socket2.close();
                        return resolve();
                    });
                }, 50);
            });
        };

        return Promise.all([test(connectionUrlUs), test(connectionUrlEu), test(connectionUrlAs)]);
    });
});

describe(serverEvents.addHero, function() {
    let socket;

    beforeEach(function () {
        socket = getAuthenticatedSocket(battleNetId, connectionUrlUs);
    });

    afterEach(function() {
        socket.close();
    });

    it('should handle adding multiple heros for a single player', function(done) {
        socket.emit(serverEvents.addHero, randomString.generate());
        socket.emit(serverEvents.addHero, randomString.generate());
        socket.emit(serverEvents.addHero, randomString.generate());

        // Ensure hero is fully added before we connect the 2nd user
        setTimeout(function() {
            let socket2 = getAuthenticatedSocket('testUser2#1234', connectionUrlUs);

            socket2.on(clientEvents.initialData, (data) => {
                assert.lengthOf(data, 3);
                socket2.close();
                done();
            });
        }, 50);
    });

    it('should call the heroAdded event on all connected clients', function(done) {
        let socket2;
        let heroName = randomString.generate();

        socket2 = getAuthenticatedSocket(randomString.generate(), connectionUrlUs);

        socket2.on(clientEvents.initialData, () => {
            socket.emit(serverEvents.addHero, heroName);
        });

        socket2.on('heroAdded', (hero) => {
            assert.equal(hero.heroName, heroName);
            socket2.close();
            done();
        });
    });

    it('should not call the heroAdded event for players in other ranks', function(done) {
        let socket2;
        let heroName = randomString.generate();

        socket2 = getAuthenticatedSocket('goldPlayer#1234', connectionUrlUs);

        socket2.on(clientEvents.initialData, () => {
            socket.emit(serverEvents.addHero, heroName);
        });

        socket2.on('heroAdded', () => {
            assert.fail();
        });

        //Give some time for the handler to be called
        setTimeout(() => {
            socket2.close();
            done();
        }, 100);
    });

    it('should not call the heroAdded event for players in other regions', function(done) {
        let socket2;
        let heroName = randomString.generate();

        socket2 = getAuthenticatedSocket(randomString.generate(), connectionUrlEu);

        socket2.on(clientEvents.initialData, () => {
            socket.emit(serverEvents.addHero, heroName);
        });

        socket2.on('heroAdded', () => {
            assert.fail();
        });

        //Give some time for the handler to be called
        setTimeout(() => {
            socket2.close();
            done();
        }, 100);
    });
});

describe('removeHero', function() {
    let socket;

    beforeEach(function() {
        socket = getAuthenticatedSocket(battleNetId, connectionUrlUs);
    });

    afterEach(function() {
        socket.close();
    });

    it('should send out hero removed event', function(done) {
        let heroName = randomString.generate();

        socket.on(clientEvents.initialData, () => {
            socket.emit(serverEvents.addHero, heroName);
        });

        socket.on(clientEvents.heroAdded, () => {
            socket.emit(serverEvents.removeHero, heroName);
        });

        socket.on(clientEvents.heroRemoved, (data) => {
            assert.equal(data.heroName, heroName);
            done();
        });
    });

    it('should remove heros from initalData', function(done) {
        let heroName = randomString.generate();

        socket.on(clientEvents.initialData, () => {
            socket.emit(serverEvents.addHero, heroName);
        });

        socket.on(clientEvents.heroAdded, () => {
            socket.emit(serverEvents.removeHero, heroName);
        });

        socket.on(clientEvents.heroRemoved, () => {
            let socket2 = getAuthenticatedSocket(randomString.generate(), connectionUrlUs);

            socket2.on(clientEvents.initialData, (data) => {
                assert.lengthOf(data, 0);
                socket2.close();
                done();
            });
        });
    });

    it('should call the heroRemoved event on all connected clients', function(done) {
        let socket2;
        let heroName = randomString.generate();

        socket2 = getAuthenticatedSocket(randomString.generate(), connectionUrlUs);

        socket2.on(clientEvents.initialData, () => {
            socket2.emit(serverEvents.addHero, heroName);
        });

        socket2.on(clientEvents.heroAdded, () => {
            socket2.emit(serverEvents.removeHero, heroName);
        });

        socket.on(clientEvents.heroRemoved, (data) => {
            assert.equal(data.heroName, heroName);
            socket2.close();
            done();
        });
    });

    it('should not call the heroRemoved event for players in other ranks', function(done) {
        let socket2;
        let heroName = randomString.generate();

        socket2 = getAuthenticatedSocket('goldPlayer#1234', connectionUrlUs);

        socket2.on(clientEvents.initialData, () => {
            socket2.emit(serverEvents.addHero, heroName);
        });

        socket2.on(clientEvents.heroAdded, () => {
            socket2.emit(serverEvents.removeHero, heroName);
        });

        socket.on(clientEvents.heroRemoved, () => {
            assert.fail();
        });

        //Give some time for the handler to be called
        setTimeout(() => {
            socket2.close();
            done();
        }, 100);
    });

    it('should not call the heroRemoved event for players in other regions', function(done) {
        let socket2;
        let heroName = randomString.generate();

        socket2 = getAuthenticatedSocket(randomString.generate(), connectionUrlEu);

        socket2.on(clientEvents.initialData, () => {
            socket2.emit(serverEvents.addHero, heroName);
        });

        socket2.on(clientEvents.heroAdded, () => {
            socket2.emit(clientEvents.heroRemoved, heroName);
        });

        socket.on(clientEvents.heroRemoved, () => {
            assert.fail();
        });

        //Give some time for the handler to be called
        setTimeout(() => {
            socket2.close();
            done();
        }, 100);
    });
});

describe('InvitePlayerToGroup', function() {
    let socket;
    let leaderHero;

    beforeEach(function() {
        socket = getAuthenticatedSocket(battleNetId, connectionUrlUs);
        leaderHero = {
            battleNetId: battleNetId,
            heroName: randomString.generate()
        };
        socket.emit(serverEvents.createGroup, leaderHero);
    });

    afterEach(function() {
        socket.close();
    });

    it('Should show group details on invite', function(done) {
        let invitedHero = {
            battleNetId: randomString.generate(),
            heroName: randomString.generate()
        };

        let socket2 = getAuthenticatedSocket(invitedHero.battleNetId, connectionUrlUs);

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
        getFilledGroup(2).then((groupSockets) => {
            let invite = {
                battleNetId: randomString.generate(),
                heroName: randomString.generate()
            };

            let memberSocket = groupSockets.memberSockets[0];

            let inviteSocket = getAuthenticatedSocket(invite.battleNetId, connectionUrlUs);

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

describe('GroupInviteAccept', function() {
    let socket;
    let leaderHero;

    beforeEach(function() {
        socket = getAuthenticatedSocket(battleNetId, connectionUrlUs);
        leaderHero = {
            battleNetId: battleNetId,
            heroName: randomString.generate()
        };
        socket.emit(serverEvents.createGroup, leaderHero);
    });

    afterEach(function() {
        socket.close();
    });

    it('should inform everyone that a new member was added', function(done) {
        let invitedHero = {
            battleNetId: randomString.generate(),
            heroName: randomString.generate()
        };

        let socket2 = getAuthenticatedSocket(invitedHero.battleNetId, connectionUrlUs);

        socket2.on(clientEvents.initialData, () => {
            socket2.emit(serverEvents.addHero, invitedHero.heroName);
        });

        socket.on(clientEvents.heroAdded, () => {
            socket.emit(serverEvents.groupInviteSend, invitedHero);
        });

        socket2.on(clientEvents.groupInviteReceived, (groupDetails) => {
            socket2.emit(serverEvents.groupInviteAccept, groupDetails.groupId);
        });

        socket.on(clientEvents.groupInviteAccepted, (groupDetails) => {
            assert.equal(groupDetails.leader.battleNetId, leaderHero.battleNetId);
            assert.equal(groupDetails.leader.heroName, leaderHero.heroName);
            assert.lengthOf(groupDetails.pending, 0);
            assert.lengthOf(groupDetails.members, 1);
            assert.equal(groupDetails.members[0].heroName, invitedHero.heroName);
            assert.equal(groupDetails.members[0].battleNetId, invitedHero.battleNetId);
            done();
        });
    });

    it('should only allow people in group pending to accept invites', function(done) {
        let invitedHero = {
            battleNetId: randomString.generate(),
            heroName: randomString.generate()
        };

        let socket2 = getAuthenticatedSocket(invitedHero.battleNetId, connectionUrlUs);
        let socket3 = getAuthenticatedSocket(randomString.generate(), connectionUrlUs);

        socket2.on(clientEvents.initialData, () => {
            socket2.emit(serverEvents.addHero, invitedHero.heroName);
        });

        socket.on(clientEvents.heroAdded, () => {
            socket.emit(serverEvents.groupInviteSend, invitedHero);
        });

        // Make the uninvited socket accept the invite
        socket2.on(clientEvents.groupInviteReceived, (groupDetails) => {
            socket3.emit(serverEvents.groupInviteAccept, groupDetails.groupId);
        });

        socket3.on(clientEvents.error.groupInviteAccept, (error) => {
            assert.equal(error.err, 'Hero not invited to group');
            done();
        });
    });
});