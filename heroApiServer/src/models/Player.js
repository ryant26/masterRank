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

let PlayerSchema = new Schema({
    platformDisplayName: requiredString(),
    platform: requiredString(),
    lastUpdated: requiredDate(),
    level: requiredString(),
    portrait: requiredString(),
    skillRating: requiredNumber()
});

PlayerSchema.index({platformDisplayName: 1});
PlayerSchema.index({platformDisplayName: 'text'});
PlayerSchema.plugin(findOrCreate);
module.exports = mongoose.model('Player', PlayerSchema);

