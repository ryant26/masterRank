const express = require('express');
const router = express.Router();
const heroService = require('../../services/heroService');
const playerService = require('../../services/playerService');
const stringValidators = require('../../validators/stringValidator');
const stringValidator = stringValidators.allValidators;
const heroNameValidator = require('../../validators/heroNameValidator').validateHeroName;
const numberValidator = require('../../validators/numberValidator').allValidators;
const authenticationService = require('../../services/authenticationService');

const getTokenFromQueryParams = function(req) {
    return {
        platformDisplayName: req.query.platformDisplayName,
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

router.get('', function(req, res, next) {
    if (!stringValidator(req.query.filterBy) ||
        !stringValidators.equalIgnoreCase(req.query.filterBy, 'top') || !numberValidator(Number.parseInt(req.query.limit), 0, 51)){
        let error = new Error('Missing or malformed query parameter');
        error.status = 400;
        next(error);
    } else {
        req.query.limit = Number.parseInt(req.query.limit);
        next();
    }
});

router.get('', function(req, res, next) {
    return heroService.getTopHeroes(getTokenFromQueryParams(req), req.query.limit).then((result) => {
        res.json(result);
    }).catch((err) => {
        next(err);
    });
});

router.get('/:heroName', function (req, res, next) {
    if (!heroNameValidator(req.params.heroName)) {
        let error = new Error('Invalid hero name');
        error.status = 400;
        next(error);
    } else {
        next();
    }
});


router.get('/:heroName', function (req, res, next) {
    let user = getTokenFromQueryParams(req);
    return Promise.all([heroService.getHero(user, req.params.heroName), playerService.findOrCreatePlayer(user)]).then((results) => {
        let hero = results[0];
        let player = results[1];

        let out = {
            platformDisplayName: user.platformDisplayName,
            heroName: req.params.heroName,
            skillRating: player ? player.skillRating : 0,
            stats: hero
        };

        if(out.stats) {
            out.stats.id = undefined;
            out.stats.platformDisplayName = undefined;
            out.stats.platform = undefined;
            out.stats.region = undefined;
            out.stats.heroName = undefined;
            out.stats.lastModified = undefined;
        }

        res.json(out);
    }).catch((err) => {
        next(err);
    });
});

module.exports = {
    router,
    path: 'heros'
};