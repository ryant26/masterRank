const passport = require('passport');
const config = require('config');
const BnetStrategy = require('passport-bnet').Strategy;
const express = require('express');
const router = express.Router();
const tokenService = require('../../services/tokenService');

const bnetRegions = ['us', 'eu', 'apac'];


let generateAuthHandler = function(region) {
    return function (accessToken, refreshToken, profile, done) {
        done(null, tokenService.getToken(profile.batteltag, region, 'pc'));
    };
};

// Initialize bnet regional OAuth server strategies
bnetRegions.forEach((region) => {
    passport.use(`bnet-${region}`, new BnetStrategy({
        clientID: config.get('bnet.id'),
        clientSecret: config.get('bnet.secret'),
        callbackURL: `https://localhost/auth/bnet/callback?region=${region}`,
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
}, function(req, res, next) {
    res.redirect(`/?access_token=${req.user}`);
});

module.exports = router;
