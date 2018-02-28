const playerService = require('./playerService');
const tokenService = require('./tokenService');
const stringValidators = require('../validators/stringValidator');
const url = require('url');

let verifyPlatformDisplayName = function(req, res, next) {
    if (stringValidators.allValidators(req.user.platformDisplayName)) {
        next();
    } else {
        failureResponse(res);
    }
};

let serializeUser = function(req, res, next) {
    return playerService.findOrCreatePlayer(req.user).then((result) => {
        if(result) {
            next();
        } else {
            failureResponse(res, req.user.platformDisplayName);
        }
    });
};

let generateToken = function(req, res, next) {
    req.token = tokenService.getToken(req.user.platformDisplayName, req.user.region, req.user.platform);
    next();
};

let respond = function(req, res) {
    res.cookie('access_token', req.token, {maxAge: 90000});
    res.redirect('/');
};

let failureResponse = function(res, name) {
    res.redirect(url.format({
        pathname: '/',
        query: {
            failedLogin: true,
            platformDisplayName: name
        }
    }));
};

let authenticateWithToken = tokenService.verifyToken;

let validateTokenFromBody = tokenService.verifyBodyToken;

module.exports = {
    verifyPlatformDisplayName,
    serializeUser,
    generateToken,
    respond,
    authenticateWithToken,
    validateTokenFromBody
};