const ow = require('../../src/apiClients/PlayerClient');
let getHeroStats;

const restoreAll = function() {
    if (getHeroStats) ow.getHeroStats = getHeroStats;
};

const makeHeroAPIReturnError = function(err) {
    getHeroStats = ow.getHeroStats;

    ow.getHeroStats = function() {
        return Promise.reject(err);
    };
};

module.exports = {
    makeHeroAPIReturnError,
    restoreAll
};