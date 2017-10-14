const ow = require('../apiClients/PlayerClient');
const environment = process.env.NODE_ENV;
const mockedEnvrionments = ['unitTest', 'develop', 'multiNodeTest'];

let owPlayerApi;

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

    mockAllDependenciesForEnvironment: function() {
        if(mockedEnvrionments.find((element) => {
            return element === environment;
        })) {
            out.mockPlayerApi();
        }
    },

    restorePlayerApi: function() {
        ow.getPlayerRank = owPlayerApi;
    }
};

module.exports = out;