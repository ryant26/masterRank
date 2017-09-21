const ow = require('../../../src/apiClients/overwatch');
const mockData = require('../commonUtils/mockOverwatchData');
const sinon = require('sinon');
const passport = require('passport');
const mockBnetStrat = require('../commonUtils/mockPassportBnet');


let passportBnet = require('passport-bnet');
let bnetStrategy = passportBnet.Strategy;
passportBnet.Strategy = mockBnetStrat;

let sandbox = sinon.sandbox.create();

let token = {
    battleNetId: 'testUser#1234',
    region: 'us',
    platform: 'pc'
};

let stubOverwatchAPI = function(playerStats = mockData.playerStats, playerDetails = mockData.playerDetails) {
    sandbox.stub(ow, 'getPlayerStats').resolves(playerStats);
    sandbox.stub(ow, 'getPlayerDetails').resolves(playerDetails);
};

let stubBnetAuth = function (battleNetId = token.battleNetId, region = token.region) {
    let strategy = passport._strategies[`bnet-${region}`];
    strategy.battletag = battleNetId;
};

let restoreAllStubs = function() {
    passportBnet.Strategy = bnetStrategy;
    sandbox.restore();
};

module.exports = {
    stubOverwatchAPI,
    stubBnetAuth,
    restoreAllStubs,
    token
};



