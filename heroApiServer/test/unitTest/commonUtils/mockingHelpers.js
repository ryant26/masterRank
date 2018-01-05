const ow = require('../../../src/apiClients/overwatch');
const mockData = require('../commonUtils/mockOverwatchData');
const sinon = require('sinon');
const passport = require('passport');
const mockBnetStrat = require('../commonUtils/mockPassportBnet');
const randomString = require('randomstring');

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
    let error = new Error('Player not found');
    error.statusCode = 404;
    _reStub(ow, 'getPlayerStats').rejects(error);
};

let stubOwGetPlayerStats = function(playerStats) {
    _reStub(ow, 'getPlayerStats').resolves(playerStats);
};

let rejectOwGetPlayerDetails = function() {
    let error = new Error('Hero not found');
    error.statusCode = 404;
    _reStub(ow, 'getPlayerDetails').rejects(error);
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

let getSeedUsers = function(number, heroName) {
    let out = [];
    for (let i = 0; i < number; i++) {
        let heroConfig = getHeroConfig(randomString.generate(), heroName);
        heroConfig.kdRatio = i + 1;
        heroConfig.accuracy = i + 1;
        heroConfig.blockedPerMin = i + 1;
        heroConfig.healingPerMin = i + 1;
        heroConfig.damagePerMin = i + 1;
        heroConfig.avgObjElims = i + 1;
        heroConfig.avgObjTime = i + 1;
        out.push(heroConfig);
    }
    return out;
};

let getHeroConfig = function(platformDisplayName, heroName) {
    return {
        platformDisplayName,
        platform: 'pc',
        lastModified: new Date(),
        region: 'us',
        skillRating: 2500,
        heroName,
        hoursPlayed: 26,
        wins: 10,
        losses: 1,
        gamesPlayed: 26,
        kdRatio: 1,
        pKdRatio: 0.8,
        accuracy: 1,
        pAccuracy: 0.55,
        blockedPerMin: 3000,
        pBlockedPerMin: 0.6,
        healingPerMin: 200,
        pHealingPerMin: 40,
        damagePerMin: 1000,
        pDamagePerMin: 0.95,
        avgObjElims: 3,
        pAvgObjElims: 0.22,
        avgObjTime: 10000,
        pAvgObjTime: 0.86
    };
};

let _reStub = function (obj, func) {
    if (obj[func].restore) {
        obj[func].restore();
    }
    return sandbox.stub(obj, func);
};

module.exports = {
    getSeedUsers,
    getHeroConfig,
    stubOverwatchAPI,
    stubBnetAuth,
    stubOwGetPlayerStats,
    stubOwGetPlayerDetails,
    stubOwSearchForPlayer,
    rejectOwGetPlayerDetails,
    rejectOwGetPlayerStats,
    restoreAllStubs,
    token,
    bnetFailureCode
};



