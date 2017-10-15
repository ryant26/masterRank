const request = require('request-promise');
const config = require('config');


// const heroUrl = config.get('heroApi.url');
const playerUrl = `${config.get('playerApi.baseUrl')}:${config.get('playerApi.port')}${config.get('playerApi.endpoint')}`;
const heroUrl = `${config.get('heroApi.baseUrl')}:${config.get('heroApi.port')}${config.get('heroApi.endpoint')}`;
const token = config.get('heroApi.token');

let getPlayerRank = function(platformDisplayName, region, platform) {
    return request({url: playerUrl,
        qs: {platformDisplayName, region, platform},
        headers: {Authorization: `Bearer ${token}`}})
        .then((result) => {
            let player = JSON.parse(result);
            return {rank: mapSrToRank(player.skillRating), region, platform};
        });
};

let getHeroStats = function(platformDisplayName, region, platform, heroName) {
    return request({
        url: `${heroUrl}/${heroName}`,
        qs: {platformDisplayName, region, platform},
        headers: {Authorization: `Bearer ${token}`}})
        .then((result) => {
            return JSON.parse(result);
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