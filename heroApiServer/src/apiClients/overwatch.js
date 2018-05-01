let ow = require('oversmash').default({
    accountIdentityRegex: /^\/career\/([\w]+)\/.+$/
});

let getPlayerDetails = function(token) {
    return getAccountInfo(token.platformDisplayName).then((result) => {
        return result.accounts.find((element) => element.platform === token.platform
            && element.displayName === token.platformDisplayName);
    });
};

let searchForPlayer = function(token) {
    return getAccountInfo(token.platformDisplayName).then((result) => {
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

let getAccountInfo = function(platformDisplayName) {
    return ow.player(encodeURIComponent(platformDisplayName));
};

let getPlayerStats = function(token) {
    let playerId = _normalizeId(token.platformDisplayName);
    return ow.playerStats(playerId, null, token.platform);
};

let _normalizeId = function(platformDisplayName) {
    return encodeURIComponent(platformDisplayName.replace('#', '-'));
};

module.exports = {
    getPlayerDetails,
    getPlayerStats,
    searchForPlayer
};