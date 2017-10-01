const express = require('express');
const router = express.Router();
const heroService = require('../../services/heroService');

router.get('/heros/:heroName', function(req, res, next) {
    if(!req.query.platformDisplayName || !req.query.region || !req.query.platform) {
        let error = new Error('Missing or malformed query parameter');
        error.status = 400;
        next(error);
    }
    next();
});

router.get('/heros/:heroName', function (req, res, next) {
    return heroService.findAndUpdateOrCreateHero({
        battleNetId: req.query.platformDisplayName,
        region: req.query.region,
        platform: req.query.platform
    }, req.params.heroName).then((player) => {
        res.json(player);
    }).catch((err) => {
        next(err);
    });
});

module.exports = router;