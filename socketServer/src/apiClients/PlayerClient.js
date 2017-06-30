let getPlayerRank = function(battleNetId, region) {
    // TODO query playerAPI
    return new Promise((resolve) => {
        resolve({rank: 'diamond', region});
    });
};

module.exports = {
    getPlayerRank
};