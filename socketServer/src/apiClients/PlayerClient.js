let getPlayerRank = function(battleNetId, region) {
    // TODO query playerAPI
    let rank = 'diamond';

    if(battleNetId === 'goldPlayer#1234') rank = 'gold';
    if(battleNetId === 'silverPlayer#1234') rank = 'silver';
    return new Promise((resolve) => {
        resolve({rank, region});
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