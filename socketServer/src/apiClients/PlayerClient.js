const request = require('request-promise');
const config = require('config');
const apiRouter = require('./apiRouter');

// const heroUrl = config.get('heroApi.url');
const playerUrl = apiRouter.getEndpoint(config.get('playerApi.baseUrl'), config.get('playerApi.port'), config.get('playerApi.endpoint'));
const heroUrl = apiRouter.getEndpoint(config.get('heroApi.baseUrl'), config.get('heroApi.port'), config.get('heroApi.endpoint'));
const token = config.get('heroApi.token');

let getSkillRating = function(platformDisplayName, region, platform) {
    return request({url: playerUrl,
        qs: {platformDisplayName, region, platform},
        headers: {Authorization: `Bearer ${token}`}})
        .then((result) => {
            let player = JSON.parse(result);
            return player.skillRating;
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

module.exports = {
    getSkillRating,
    getHeroStats
};