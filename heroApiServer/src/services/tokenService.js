const jwt = require('jsonwebtoken');
const config = require('config');
const expressJwt = require('express-jwt');

const tokenSecret = config.get('token.secret');
const tokenExpiry = config.get('token.expiry');

let getToken = function(battleNetId, region, platform) {
    return jwt.sign({battleNetId, region, platform, exp: tokenExpiry}, tokenSecret);
};

let verifyToken = expressJwt({secret: tokenSecret});

module.exports = {
    getToken,
    verifyToken
};