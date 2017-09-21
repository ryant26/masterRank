const passport = require('passport');
const config = require('config');
const BnetStrategy = require('passport-bnet').Strategy;
const express = require('express');
const router = express.Router();
const authenticationService = require('../../services/authenticationService');

const bnetRegions = ['us', 'eu', 'apac'];
const port = config.has('proxy.port') ? `:${config.get('proxy.port')}` : '';
const domainName = config.get('app.hostname') + port;

let generateAuthHandler = function(region) {
    return function (accessToken, refreshToken, profile, done) {
        done(null, {battleNetId: profile.battletag, region, platform: 'pc'});
    };
};

// Initialize bnet regional OAuth server strategies
bnetRegions.forEach((region) => {
    passport.use(`bnet-${region}`, new BnetStrategy({
        clientID: config.get('bnet.id'),
        clientSecret: config.get('bnet.secret'),
        callbackURL: `https://${domainName}/auth/bnet/callback?region=${region}`,
        region: `${region}`
    }, generateAuthHandler(region)));
});

router.get('/bnet', function (req, res, next) {
    passport.authenticate(`bnet-${req.query.region}`)(req, res, next);
});

router.get('/bnet/callback', function (req, res, next) {
    passport.authenticate(`bnet-${req.query.region}`, {
        failureRedirect: '/',
        session: false
    })(req, res, next);
}, authenticationService.serializeUser, authenticationService.generateToken, authenticationService.respond);

module.exports = router;
