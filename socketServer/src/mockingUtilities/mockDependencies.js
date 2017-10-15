const ow = require('../apiClients/PlayerClient');
const environment = process.env.NODE_ENV;
const mockedEnvrionments = ['unitTest', 'develop', 'multiNodeTest'];

let owPlayerApi;
let owHeroApi;

let out  = {
    mockPlayerApi: function() {
        owPlayerApi = ow.getPlayerRank;

        ow.getPlayerRank = function(battleNetId, region, platform) {
            let rank = 'diamond';

            if(battleNetId === 'goldPlayer#1234') rank = 'gold';
            if(battleNetId === 'silverPlayer#1234') rank = 'silver';
            return new Promise((resolve) => {
                resolve({rank, region, platform});
            });
        };
    },

    mockHeroApi: function() {
        owHeroApi = ow.getHeroStats;

        ow.getHeroStats = function(battleNetId, region, platform, heroName) {
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
    },

    mockAllDependenciesForEnvironment: function() {
        if(mockedEnvrionments.find((element) => {
            return element === environment;
        })) {
            out.mockPlayerApi();
            out.mockHeroApi();
        }
    },

    restorePlayerApi: function() {
        ow.getPlayerRank = owPlayerApi;
        ow.getHeroStats = owHeroApi;
    }
};

module.exports = out;