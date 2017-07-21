let logger = require('winston');
let RedisClient = require('../apiClients/RedisClient');

/**
 * This object handles websocket events for grouping activities
 * @param config.socket - Websocket
 * @param config.socket.token - Access token
 * @constructor
 */
let GroupController = function (config) {
    let socket = config.socket;
    let token = socket.token;

    let createNewGroup = function (groupLeader) {
        return RedisClient.getUniqueGroupId().then((id) => {

        });
    };
};

module.exports = GroupController;