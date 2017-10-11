const express = require('express');
const router = express.Router();
const playerService = require('../../services/playerService');
const stringValidator = require('../../validators/stringValidator').allValidators;

router.get('/players', function(req, res, next) {
    if(!stringValidator(req.query.platformDisplayName, req.query.platform, req.query.region)) {
        let error = new Error('Missing or malformed query parameter');
        error.status = 400;
        next(error);
    }

    next();
});

router.get('/players', function (req, res) {
    return playerService.findAndUpdatePlayer({battleNetId: req.query.platformDisplayName,
        region: req.query.region,
        platform: req.query.platform})
        .then((player) => {
            res.json(player);
        });
});

router.get('/players/search', function(req, res, next) {
    if(!stringValidator(req.query.platformDisplayName)) {
        let error = new Error('Missing or malformed query parameter');
        error.status = 400;
        next(error);
    }

    next();
});

router.get('/players/search', function (req, res) {
    return playerService.searchForPlayer({
        battleNetId: req.query.platformDisplayName,
        platform: req.query.platform,
        region: req.query.region
    }).then((players) => {
        res.json(players);
    });
});

module.exports = router;