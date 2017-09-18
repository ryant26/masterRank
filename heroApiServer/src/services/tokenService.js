const jwt = require('jsonwebtoken');
const config = require('config');

const tokenSecret = config.get('token.secret');
const tokenExpiry = config.get('token.expiry');

let getToken = function(battleNetId, region, platform) {
    return jwt.sign({battleNetId, region, platform, exp: tokenExpiry}, tokenSecret);
};

module.exports = {
    getToken
};