const ow = require('../apiClients/PlayerClient');
const authentication = require('../apiClients/authenticationClient');
const jwt = require('jsonwebtoken');
const environment = process.env.NODE_ENV;
const mockedEnvrionments = ['unitTest', 'multiNodeTest'];

let owPlayerApi;
let owHeroApi;
let authApi;

let out  = {
    mockPlayerApi: function() {
        owPlayerApi = ow.getPlayerRank;

        ow.getPlayerRank = function(platformDisplayName, region, platform) {
            let rank = 'diamond';

            if(platformDisplayName === 'goldPlayer#1234') rank = 'gold';
            if(platformDisplayName === 'silverPlayer#1234') rank = 'silver';
            return new Promise((resolve) => {
                resolve({rank, region, platform});
            });
        };
    },

    mockHeroApi: function() {
        owHeroApi = ow.getHeroStats;

        ow.getHeroStats = function(platformDisplayName, region, platform, heroName) {
            return new Promise((resolve) => {
                resolve({
                    eliminations: 10,
                    winPercentage: 65,
                    platformDisplayName,
                    region,
                    platform,
                    heroName
                });
            });
        };
    },

    mockAuthenticationApi: function() {
        authApi = authentication.authenticate;
        authentication.authenticate = function (tokenString) {
            return Promise.resolve(jwt.decode(tokenString));
        };
    },

    mockAllDependenciesForEnvironment: function() {
        if(mockedEnvrionments.find((element) => {
            return element === environment;
        })) {
            out.mockPlayerApi();
            out.mockHeroApi();
            out.mockAuthenticationApi();
        }
    },

    restorePlayerApi: function() {
        ow.getPlayerRank = owPlayerApi;
        ow.getHeroStats = owHeroApi;
        authentication.authenticate = authApi;
    }
};

module.exports = out;