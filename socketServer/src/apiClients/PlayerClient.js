let getPlayerRank = function(battleNetId, region) {
    // TODO query playerAPI
    return new Promise((resolve) => {
        resolve({rank: 'diamond', region});
    });
};

let getHeroStats = function(battleNetId, region, hero) {
    return new Promise((resolve) => {
        resolve({
            eliminations: 10,
            winPercentage: 65,
            battleNetId,
            region,
            hero
        });
    });
};

module.exports = {
    getPlayerRank,
    getHeroStats
};