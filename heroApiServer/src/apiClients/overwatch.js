let ow = require('oversmash').default({
    accountIdentityRegex: /^\/career\/([\w]+)\/.+$/
});

let getPlayerDetails = function(token) {
    return ow.player(token.battleNetId).then((result) => {
        return result.accounts.find((element) => element.platform === token.platform);
    });
};

let searchForPlayer = function(token) {
    return ow.player(token.battleNetId).then((result) => {
        result = result.accounts;

        result.forEach((account) => {
            account.platformDisplayName = account.displayName;
            delete account.displayName;
        });

        if (token.platform) {
            result = result.filter((element) => {
                return element.platform === token.platform;
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