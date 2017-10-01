const playerService = require('./playerService');
const tokenService = require('./tokenService');

let serializeUser = function(req, res, next) {
    return playerService.findOrCreatePlayer(req.user).then(() => {
        next();
    });
};

let generateToken = function(req, res, next) {
    req.token = tokenService.getToken(req.user.battleNetId, req.user.region, req.user.platform);
    next();
};

let respond = function(req, res) {
    res.setHeader('set-cookie', `access_token=${req.token}`);
    res.redirect('/');
};

let authenticateWithToken = tokenService.verifyToken;

module.exports = {
    serializeUser,
    generateToken,
    respond,
    authenticateWithToken
};