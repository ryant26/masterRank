const assert = require('chai').assert;
const commonUtilities = require('../functionalTest/commonUtilities');
const config = require('config');
const randomString = require('randomstring');
const clientEvents = require('../../src/socketEvents/clientEvents');
const serverEvents = require('../../src/socketEvents/serverEvents');

const port1 = 3000;
const port2 = 3001;
const server1Url = `${config.get('url')}:${port1}/us`;
const server2Url = `${config.get('url')}:${port2}/us`;

describe('Multi-Node Tests', function() {
    afterEach(function() {
        commonUtilities.closeOpenedSockets();
    });

    it('should be able to see added heros from other nodes', function(done) {
        let serv1Hero = {
            battleNetId: randomString.generate(),
            heroName: randomString.generate()
        };

        commonUtilities.getUserWithAddedHero(serv1Hero.battleNetId, serv1Hero.heroName, server1Url).then(() => {
            let socket2 = commonUtilities.getAuthenticatedSocket(randomString.generate(), server2Url);

            socket2.on(clientEvents.initialData, (data) => {
                assert.lengthOf(data, 1);
                assert.equal(data[0].heroName, serv1Hero.heroName);
                done();
            });
        });
    });

    it('should be able to invite hero from another node to group', function(done) {
        let serv1Hero = {
            battleNetId: randomString.generate(),
            heroName: randomString.generate()
        };

        let serv2Hero = {
            battleNetId: randomString.generate(),
            heroName: randomString.generate()
        };

        let leadersocket, user2;

        commonUtilities.getEmptyGroup(server1Url).then((group) => {
            leadersocket = group.leaderSocket;
            return commonUtilities.getUserWithAddedHero(serv2Hero.battleNetId, serv2Hero.heroName, server2Url);
        }).then((serv2User) => {
            user2 = serv2User;

            user2.socket.on(clientEvents.groupInviteReceived, (details) => {
                assert.equal(details.leader.battleNetId, serv2Hero.battleNetId);
                done();
            });

            leadersocket.emit(serverEvents.groupInviteSend, serv1Hero);
        });
    });
});