let ow = require('oversmash').default();

let getPlayerDetails = function(token) {
    let playerId = _normalizeId(token.battleNetId);
    return ow.player(playerId).then((result) => {
        return result.accounts.find((element) => {return element.region === token.region && element.platform === token.platform;});
    });
};

let searchForPlayer = function(token) {
    return ow.player(_normalizeId(token.battleNetId)).then((result) => {
        result = result.accounts;

        if (token.platform) {
            result = result.filter((element) => {
                return element.platform === token.platform;
            });
        }

        if (token.region) {
            result = result.filter((element) => {
                return element.region === token.region;
            });
        }

        return result;
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
    getPlayerStats,
    searchForPlayer
};