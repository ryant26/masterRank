const authenticationService = require('../../../services/authenticationService');
const playerService = require('../../../services/playerService');
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const router = express.Router();


let self = {
    /**
     * This adds a local strategy to passport for authentication
     * @param opts
     * @param {string} opts.platform - configures the appropriate platform for the user lookup and sets up the routing at this path
     * @param {string} opts.name - name for the authentication scheme
     * @returns {*} - router
     */
    strategy: function (opts) {
        passport.use(opts.name, new LocalStrategy({
            session: false,
            passReqToCallback: true
        }, function (req, username, password, done) {
            let region = req.query.region;
            let token = {battleNetId: username, region, platform: opts.platform};
            playerService.findOrCreatePlayer(token).then((player) => {
                if (player) {
                    done(null, token);
                } else {
                    done('invalid credentials');
                }
            });
        }));

        router.post(`/${opts.platform}/callback`, passport.authenticate(opts.name, {
            failureRedirect: self.failureRedirect,
            session: false
        }), authenticationService.serializeUser, authenticationService.generateToken, authenticationService.respond);
        return router;
    },

    failureRedirect: '/?failedLogin=true'
};

module.exports = self;



