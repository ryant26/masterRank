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
        owPlayerApi = ow.getSkillRating;

        ow.getSkillRating = function(platformDisplayName) {
            let skillRating = 3100;

            if(platformDisplayName === 'goldPlayer#1234') skillRating = 2300;
            if(platformDisplayName === 'silverPlayer#1234') skillRating = 1800;
            return new Promise((resolve) => {
                resolve(skillRating);
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
        ow.getSkillRating = owPlayerApi;
        ow.getHeroStats = owHeroApi;
        authentication.authenticate = authApi;
    }
};

module.exports = out;