const playerService = require('./playerService');
const tokenService = require('./tokenService');

let serializeUser = function(req, res, next) {
    return playerService.findOrCreatePlayer(req.user).then((result) => {
        if(result) {
            next();
        } else {
            next(new Error('Could not find Overwatch player account'));
        }
    });
};

let generateToken = function(req, res, next) {
    req.token = tokenService.getToken(req.user.platformDisplayName, req.user.region, req.user.platform);
    next();
};

let respond = function(req, res) {
    res.setHeader('set-cookie', `access_token=${req.token}`);
    res.redirect('/');
};

let authenticateWithToken = tokenService.verifyToken;

let validateTokenFromBody = tokenService.verifyBodyToken;

module.exports = {
    serializeUser,
    generateToken,
    respond,
    authenticateWithToken,
    validateTokenFromBody
};