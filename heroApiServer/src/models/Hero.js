const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate');


let requiredString = function() {
    return {
        type: String,
        required: true
    };
};

let requiredNumber = function() {
    return {
        type: Number,
        required: true
    };
};

let requiredDate = function() {
    return {
        type: Date,
        required: true
    };
};

let HeroSchema = new Schema({
    platformDisplayName: requiredString(),
    platform: requiredString(),
    region: requiredString(),
    lastModified: requiredDate(),
    heroName: requiredString(),
    hoursPlayed: requiredNumber(),
    wins: requiredNumber(),
    losses: requiredNumber(),
    gamesPlayed: requiredNumber(),
    kdRatio: requiredNumber(),
    pKdRatio: requiredNumber(),
    accuracy: requiredNumber(),
    pAccuracy: requiredNumber(),
    blockedPerMin: requiredNumber(),
    pBlockedPerMin: requiredNumber(),
    healingPerMin: requiredNumber(),
    pHealingPerMin: requiredNumber(),
    damagePerMin: requiredNumber(),
    pDamagePerMin: requiredNumber(),
    avgObjElims: requiredNumber(),
    pAvgObjElims: requiredNumber(),
    avgObjTime: requiredNumber(),
    pAvgObjTime: requiredNumber()
});

HeroSchema.index({platformDisplayName: 1});
HeroSchema.plugin(findOrCreate);
module.exports = mongoose.model('Hero', HeroSchema);

