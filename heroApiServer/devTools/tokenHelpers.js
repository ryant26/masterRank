const jwt = require('jsonwebtoken');
const config = require('config');
const tokenSecret = config.get('token.secret');

let getValidToken = function(platformDisplayName, region, platform) {
    return jwt.sign({platformDisplayName, region, platform, exp: Date.now() + 1000000}, tokenSecret);
};

let getExpiredToken = function(platformDisplayName, region, platform) {
    return jwt.sign({platformDisplayName, region, platform, exp: 1}, tokenSecret);
};

let getTokenSignedWithOldSecret = function(platformDisplayName, region, platform) {
    return jwt.sign({platformDisplayName, region, platform, exp: Math.floor(Date.now() / 1000) + 10000}, 'issa secret');
};

module.exports = {
    getExpiredToken,
    getTokenSignedWithOldSecret,
    getValidToken
};
