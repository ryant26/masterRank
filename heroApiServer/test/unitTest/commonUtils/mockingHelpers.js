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

let bnetFailureCode = 'failure';

let stubOverwatchAPI = function(playerStats = mockData.emptyPlayerStats, playerDetails = mockData.playerDetails) {
    stubOwGetPlayerStats(playerStats);
    stubOwGetPlayerDetails(playerDetails);
    stubOwSearchForPlayer([playerDetails]);
};

let rejectOwGetPlayerStats = function() {
    _reStub(ow, 'getPlayerStats').rejects({statusCode: 404});
};

let stubOwGetPlayerStats = function(playerStats) {
    _reStub(ow, 'getPlayerStats').resolves(playerStats);
};

let stubOwGetPlayerDetails = function(playerDetails) {
    _reStub(ow, 'getPlayerDetails').resolves(playerDetails);
};

let stubOwSearchForPlayer = function(output) {
    _reStub(ow, 'searchForPlayer').resolves(output);
};

let stubBnetAuth = function (battleNetId = token.battleNetId, region = token.region) {
    let strategy = passport._strategies[`bnet-${region}`];
    strategy.battletag = battleNetId;
};

let restoreAllStubs = function() {
    passportBnet.Strategy = bnetStrategy;
    sandbox.restore();
};

let _reStub = function (obj, func) {
    if (obj[func].restore) {
        obj[func].restore();
    }
    return sandbox.stub(obj, func);
};

module.exports = {
    stubOverwatchAPI,
    stubBnetAuth,
    stubOwGetPlayerStats,
    stubOwGetPlayerDetails,
    stubOwSearchForPlayer,
    rejectOwGetPlayerStats,
    restoreAllStubs,
    token,
    bnetFailureCode
};



