let logger = require('winston');

const PlayerController = function(config) {
    let socket = config.socket;
    let token = socket.token;
    let playerClient = config.PlayerClient;
    let redisClient = config.RedisClient;

    playerClient.getPlayerRank(token.battleNetId, config.region).then((rankObj) => {
        redisClient.addPlayerInfo(token.battleNetId, rankObj);
        socket.join(rankObj.rank);
        logger.info(`Player [${token.battleNetId}] joined rank [${rankObj.rank}]`);
        socket.emit('initialData', {hello: 'world'});
    });
};

module.exports = PlayerController;
