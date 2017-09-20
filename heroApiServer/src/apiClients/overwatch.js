let ow = require('oversmash').default();

let getPlayerDetails = function(token) {
    let playerId = _normalizeId(token.battleNetId);
    return ow.player(playerId).then((result) => {
        return result.find((element) => {return element.region === token.region && element.platform === token.platform});
    });
};

let getPlayerStats = function(token) {
    let playerId = _normalizeId(token.battleNetId);
    return ow.playerStats(playerId, token.region, token.platform);
};

let _normalizeId = function(battleNetId) {
    return battleNetId.replace('#', '-');
};

module.exports = {
    getPlayerDetails,
    getPlayerStats
};