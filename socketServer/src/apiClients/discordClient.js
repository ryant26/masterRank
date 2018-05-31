const Discord = require('discord.js');
const client = new Discord.Client();
const logger = require('../services/logger').sysLogger;
const config =require('config');

// Authentication Constants
const token = config.get('discordApi.token');
const guildId = config.get('discordApi.guild.id');

// API Constants
const maxAgeInSec = config.get('discordApi.invite.maxAgeInSec');
const voiceChannelType = 'voice';

const getGuild = new Promise((resolve) => {
    client.on('ready', () => {
        logger.info('Connected to discord');
        resolve(client.guilds.find((guild) => guild.id === guildId));
    });

    client.login(token);
});

const createVoiceChannel = function(groupId) {
    return getGuild.then((guild) => {
        return guild.createChannel(`group-${groupId}`, voiceChannelType);
    });
};

const getChannel = function(id) {
    return getAllChannels().then((channels) => {
        return channels.find((channel) => channel.id === id);
    });
};

const getAllChannels = function() {
    return getGuild.then((guild) => {
        return guild.channels;
    });
};

const deleteChannel = function(id) {
    return getChannel(id).then((channel) => {
        return channel ? channel.delete() : null;
    });
};

const getVoiceChannelInvite = function(groupId) {
    return createVoiceChannel(groupId).then((channel) => {
        return channel.createInvite({
            temporary: true,
            maxAge: maxAgeInSec
        });
    }).then((invite) => {
        return {
            id: invite.channel.id,
            url: invite.url
        };
    });
};

module.exports = {
    createVoiceChannel: createVoiceChannel,
    getChannel: getChannel,
    getAllChannels: getAllChannels,
    deleteVoiceChannel: deleteChannel,
    getVoiceChannelInvite: getVoiceChannelInvite
};