let getPlayerRank = function(battleNetId, region, platform) {
    // TODO query playerAPI
    let rank = 'diamond';

    if(battleNetId === 'goldPlayer#1234') rank = 'gold';
    if(battleNetId === 'silverPlayer#1234') rank = 'silver';
    return new Promise((resolve) => {
        resolve({rank, region, platform});
    });
};

let getHeroStats = function(battleNetId, region, platform, heroName) {
    return new Promise((resolve) => {
        resolve({
            eliminations: 10,
            winPercentage: 65,
            battleNetId,
            region,
            platform,
            heroName
        });
    });
};

module.exports = {
    getPlayerRank,
    getHeroStats
};