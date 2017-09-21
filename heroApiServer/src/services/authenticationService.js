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
    res.redirect(`/?access_token=${req.token}`);
};

module.exports = {
    serializeUser,
    generateToken,
    respond
};