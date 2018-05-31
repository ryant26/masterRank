const assert = require('chai').assert;
const client = require('../../../src/apiClients/discordClient');

const timeout = 20000;

describe('Discord API', function() {
    this.timeout(timeout);

    afterEach(function() {
        return client.getAllChannels().then((channels) => {
            return Promise.all(channels.map((channel) => channel.delete()));
        });
    });

    describe('createVoiceChannel', function() {
        const groupId = 2;
        
        it('should create a channel with the group ID in the name', function() {
            return client.createVoiceChannel(groupId).then((channel) => {
                return client.getChannel(channel.id);
            }).then((channel) => {
                assert.include(channel.name, groupId);
            });
        });

        it('should create a channel of type voice', function() {
            return client.createVoiceChannel(groupId).then((channel) => {
                return client.getChannel(channel.id);
            }).then((channel) => {
                assert.equal(channel.type, 'voice');
            });
        });
    });

    describe('getChannel', function() {
        it('should return the correct channel', function() {
            const myGroupId = 1234;
            let createdChannel;

            return client.createVoiceChannel(myGroupId).then((channel) => {
                createdChannel = channel;
                return client.getChannel(channel.id);
            }).then((channel) => {
                assert.deepEqual(createdChannel, channel);
            });
        });
    });

    describe('getAllChannels', function() {
        it('should return all channels on the server', function(){
            const channel1 = 'chan1';
            const channel2 = 'chan2';
            const channel3 = 'chan3';

            let channelArray;

            return Promise.all([
                client.createVoiceChannel(channel1),
                client.createVoiceChannel(channel2),
                client.createVoiceChannel(channel3)
            ]).then((results) => {
                channelArray = results;
                return client.getAllChannels();
            }).then((results) => {
                assert.containsAllKeys(results, channelArray.map((channel) => channel.id));
            });
        });
    });

    describe('deleteChannel', function() {
        it('should delete a channel while leaving all others', function() {
            const channel1 = 'chan1';
            const channel2 = 'chan2';
            const channel3 = 'chan3';

            let channelArray;

            return Promise.all([
                client.createVoiceChannel(channel1),
                client.createVoiceChannel(channel2),
                client.createVoiceChannel(channel3)
            ]).then((results) => {
                channelArray = results;
                return client.deleteVoiceChannel(results[0].id);
            }).then(() => {
                return client.getAllChannels();
            }).then((results) => {
                let containedChannels = [channelArray[1], channelArray[2]];
                assert.containsAllKeys(results, containedChannels.map((channel) => channel.id));
                assert.doesNotHaveAnyKeys(results, [channelArray[0].id]);
            });
        });
    });

    describe('getVoiceChannelInvite', function() {
        const groupId = 10;

        it('should create a channel', function() {
            let channelId;

            return client.getVoiceChannelInvite(groupId).then((invite) => {
                channelId = invite.id;
                return client.getChannel(channelId);
            }).then((channel) => {
                assert.equal(channelId, channel.id);
            });
        });

        it('should return a url in the invite', function() {
            return client.getVoiceChannelInvite(groupId).then((invite) => {
                assert.isNotNull(invite.url);
            });
        });
    });
});