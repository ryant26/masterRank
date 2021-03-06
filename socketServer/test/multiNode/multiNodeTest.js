const assert = require('chai').assert;
const CommonUtilities = require('../unitTest/CommonUtilities');
const config = require('config');
const randomString = require('randomstring');
const clientEvents = require('../../../shared/libs/socketEvents/clientEvents');
const serverEvents = require('../../../shared/libs/socketEvents/serverEvents');
const logger = require('winston');
const exec = require('child_process').exec;

const port1 = 3000;
const port2 = 3001;
const server1Url = `${config.get('url')}:${port1}`;
const server2Url = `${config.get('url')}:${port2}`;

let server1Utilities = new CommonUtilities({
    url: server1Url
});

let server2Utilities = new CommonUtilities({
    url: server2Url
});

let startServer = function (port) {
    return exec(`NODE_ENV=multiNodeTest node src/app.js --NODE_CONFIG='{"port":${port}}'`, (err, stdout, stderr) => {
        logger.info(stdout);
        logger.info(stderr);
    });
};

describe('Multi-Node Tests', function() {
    let server1, server2;
    this.timeout(5000);

    before(function () {
        server1 = startServer(3000);
        server2 = startServer(3001);
        //TODO Start a mockHeroApi server
    });

    after(function (done) {
        //Temporary solution to allow for sockets to close
        setTimeout(() => {
            server1.kill('SIGINT');
            server2.kill('SIGINT');
            done();
        }, 500);
    });

    afterEach(function() {
        server1Utilities.closeOpenedSockets();
        server2Utilities.closeOpenedSockets();
    });

    it('should be able to see added heros from other nodes', function(done) {
        let serv1Hero = {
            platformDisplayName: randomString.generate(),
            heroName: 'tracer'
        };

        server1Utilities.getUserWithAddedHero(serv1Hero.platformDisplayName, serv1Hero.heroName).then(() => {
            server2Utilities.getAuthenticatedSocket(randomString.generate()).then((data) => {
                assert.lengthOf(data.initialData, 1);
                assert.equal(data.initialData[0].heroName, serv1Hero.heroName);
                done();
            });
        });
    });

    it('should be able to invite hero from another node to group', function(done) {
        let serv2Hero = {
            platformDisplayName: randomString.generate(),
            heroName: 'genji'
        };

        let leadersocket, leaderHero, user2;

        server1Utilities.getEmptyGroup().then((group) => {
            leadersocket = group.leaderSocket;
            leaderHero = group.leaderHero;
            return server2Utilities.getUserWithAddedHero(serv2Hero.platformDisplayName, serv2Hero.heroName);
        }).then((serv2User) => {
            user2 = serv2User;

            user2.socket.on(clientEvents.groupInviteReceived, (details) => {
                assert.equal(details.leader.platformDisplayName, leaderHero.platformDisplayName);
                assert.deepEqual(details.pending[0].platformDisplayName, serv2Hero.platformDisplayName);
                done();
            });

            leadersocket.emit(serverEvents.groupInviteSend, serv2Hero);
        });
    });

    it('should be able to accept invite to group from another node', function (done) {
        let invitee = {
            platformDisplayName: randomString.generate(),
            heroName: 'tracer'
        };

        let groupDetails;

        server1Utilities.getFilledGroup(2).then((details) => {
            groupDetails = details;
            return server2Utilities.getUserWithAddedHero(invitee.platformDisplayName, invitee.heroName);
        }).then((user) => {
            groupDetails.memberSockets[0].on(clientEvents.groupInviteAccepted, (details) => {
                let invitedHero = details.members.find((hero) => {
                    return hero.platformDisplayName === invitee.platformDisplayName;
                });
                assert(invitedHero);
                done();
            });

            user.socket.on(clientEvents.groupInviteReceived, (details) => {
                user.socket.emit(serverEvents.groupInviteAccept, details.groupId);
            });

            return groupDetails.leaderSocket.emit(serverEvents.groupInviteSend, invitee);
        });
    });

    it('should be able to decline an invite from another server', function(done) {
        let groupDetails;
        server1Utilities.getFilledGroup(2).then((details) => {
            groupDetails = details;
            details.memberSockets[1].on(clientEvents.groupInviteDeclined, (declineDetails) => {
                assert.lengthOf(declineDetails.pending, 0);
                done();
            });

            return server2Utilities.getUserWithAddedHero();
        }).then((user) => {
            user.socket.on(clientEvents.groupInviteReceived, (inviteDetails) => {
                user.socket.emit(serverEvents.groupInviteDecline, inviteDetails.groupId);
            });

            groupDetails.leaderSocket.emit(serverEvents.groupInviteSend, user.hero);
        });
    });

    it('should be able to remove a pending hero from another node', function(done) {
        let invitedHero = {
            platformDisplayName: randomString.generate(),
            heroName: 'tracer'
        };

        server1Utilities.getEmptyGroup().then((groupDetails) => {
            let socket = groupDetails.leaderSocket;

            socket.on(clientEvents.playerInviteCanceled, (details) => {
                assert.lengthOf(details.pending, 0);
                done();
            });

            server2Utilities.getUserWithAddedHero(invitedHero.platformDisplayName, invitedHero.heroName).then((user) => {
                user.socket.on(clientEvents.groupInviteReceived, () => {
                    socket.emit(serverEvents.groupInviteCancel, invitedHero);
                });

                socket.emit(serverEvents.groupInviteSend, invitedHero);
            });
        });
    });
});