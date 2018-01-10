const jwt = require('jsonwebtoken');
const config = require('config');
const expressJwt = require('express-jwt');

const tokenSecret = config.get('token.secret');
const tokenExpiry = config.get('token.expiry');

let getToken = function(platformDisplayName, region, platform) {
    return jwt.sign({platformDisplayName, region, platform, exp: Math.floor(Date.now() / 1000) + tokenExpiry}, tokenSecret);
};

let verifyToken = expressJwt({secret: tokenSecret});

let verifyBodyToken = expressJwt({secret: tokenSecret, getToken: function fromBody(req) {
    if (req.body && req.body.token) {
        return req.body.token;
    }

    return null;
}});

module.exports = {
    getToken,
    verifyToken,
    verifyBodyToken
};