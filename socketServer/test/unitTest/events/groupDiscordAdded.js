const chai = require('chai');
const assert = chai.assert;
const randomString = require('randomstring');
const serverEvents = require('../../../../shared/libs/socketEvents/serverEvents');
const clientEvents = require('../../../../shared/libs/socketEvents/clientEvents');
const CommonUtilities = require('../CommonUtilities');

let commonUtilities = new CommonUtilities();

// Start the Socket Server
require('../../../src/app');

describe(clientEvents.groupDiscordAdded, function() {
    let socket;

    this.timeout(20000);

    beforeEach(function() {
        return commonUtilities.getEmptyGroup().then((group) => {
            socket = group.leaderSocket;
        });
    });

    afterEach(function() {
        return commonUtilities.closeOpenedSockets();
    });

    it('should inform everyone that a discord was added', function(done) {
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

            socket.on(clientEvents.groupDiscordAdded, (groupDetails) => {
                assert.isString(groupDetails.discord.url);
                assert.isNotEmpty(groupDetails.discord.url);
                done();
            });

            socket2.emit(serverEvents.addHero, {heroName: invitedHero.heroName, priority: 1});
        });
    });

    it('after the event has been fired once, all subsequent group updates should contain the discord object', function(done) {
        const region = 'us';

        Promise.all([
            commonUtilities.getUserWithAddedHero(null, null, region),
            commonUtilities.getUserWithAddedHero(null, null, region)
        ]).then((data) => {
            const hero1 = data[0].hero;
            const socket1 = data[0].socket;

            const hero2 = data[1].hero;
            const socket2 = data[1].socket;

            let discordUrl;

            socket.on(clientEvents.groupDiscordAdded, (group) => {
                discordUrl = group.discord.url;
                socket.emit(serverEvents.groupInviteSend, hero2);
            });

            socket1.on(clientEvents.groupInviteReceived, (invite) => {
                socket1.emit(serverEvents.groupInviteAccept, invite.groupId);
            });

            socket2.on(clientEvents.groupInviteReceived, (invite) => {
                socket2.emit(serverEvents.groupInviteAccept, invite.groupId);
            });

            socket.on(clientEvents.groupInviteAccepted, (group) => {
                if (group.members.length == 2) {
                    assert.equal(discordUrl, group.discord.url);
                    done();
                }
            });

            socket.emit(serverEvents.groupInviteSend, hero1);
        });
    });

});