const request = require('request-promise');
const config = require('config');


const heroUrl = config.get('heroApi.url');
const playerUrl = config.get('playerApi.url');
const token = config.get('heroApi.token');

let getPlayerRank = function(battleNetId, region, platform) {
    return request({url: playerUrl,
        qs: {platformDisplayName: battleNetId, region, platform},
        headers: {Authorization: `Bearer ${token}`}})
        .then((result) => {
            let player = JSON.parse(result);
            return {rank: mapSrToRank(player.skillRating), region, platform};
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

let mapSrToRank = function(sr) {
    if(sr < 1500) {
        return 'bronze';
    } else if (sr < 2000) {
        return 'silver';
    } else if (sr < 2500) {
        return 'gold';
    } else if (sr < 3000) {
        return 'platinum';
    } else if (sr < 3500) {
        return 'diamond';
    } else if (sr < 4000) {
        return 'master';
    } else {
        return 'grandmaster';
    }
};

module.exports = {
    getPlayerRank,
    getHeroStats
};