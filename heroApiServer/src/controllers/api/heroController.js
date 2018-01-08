const express = require('express');
const router = express.Router();
const heroService = require('../../services/heroService');
const stringValidator = require('../../validators/stringValidator').allValidators;
const authenticationService = require('../../services/authenticationService');

const getTokenFromQueryParams = function(req) {
    return {
        battleNetId: req.query.platformDisplayName,
        region: req.query.region,
        platform: req.query.platform
    };
};

router.use(authenticationService.authenticateWithToken);

router.use(function(req, res, next) {
    if(!stringValidator(req.query.platformDisplayName)
        || !stringValidator(req.query.region)
        || !stringValidator(req.query.platform)) {
        let error = new Error('Missing or malformed query parameter');
        error.status = 400;
        next(error);
    } else {
        next();
    }
});

router.get('/:heroName', function (req, res, next) {
    return heroService.findAndUpdateOrCreateHero(getTokenFromQueryParams(req), req.params.heroName).then((player) => {
        if(player === null) {
            let error = new Error('Hero could not be found');
            error.status = 404;
            next(error);
        } else {
            res.json(player);
        }
    }).catch((err) => {
        next(err);
    });
});

module.exports = {
    router,
    path: 'heros'
};