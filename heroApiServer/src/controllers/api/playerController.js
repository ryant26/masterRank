const express = require('express');
const router = express.Router();
const playerService = require('../../services/playerService');
const stringValidator = require('../../validators/stringValidator').allValidators;
const decode = require('jwt-decode');
const authenticationService = require('../../services/authenticationService');


router.get('', function(req, res, next) {
    if(!stringValidator(req.query.platformDisplayName, req.query.platform)) {
        let error = new Error('Missing or malformed query parameter');
        error.status = 400;
        next(error);
    }

    next();
});

router.get('', function (req, res, next) {
    return playerService.findOrCreatePlayer({platformDisplayName: req.query.platformDisplayName,
        region: req.query.region,
        platform: req.query.platform})
        .then((player) => {
            if(player === null){
                let error = new Error('Player could not be found');
                error.status = 404;
                next(error);
            } else {
                res.json(player);
            }
        });
});

router.get('/search', function(req, res, next) {
    if(!stringValidator(req.query.platformDisplayName)) {
        let error = new Error('Missing or malformed query parameter');
        error.status = 400;
        next(error);
    }

    next();
});

router.get('/search', function (req, res) {
    return playerService.searchForPlayer({
        platformDisplayName: req.query.platformDisplayName,
        platform: req.query.platform,
        region: req.query.region
    }).then((players) => {
        res.json(players);
    });
});

router.use('/remove', authenticationService.authenticateWithToken);

router.get('/remove', function(req, res, next) {
    const token = decode(req.headers['authorization'].split(' ')[1]);
    return playerService.findAndDeletePlayer(token)
        .then((result) => {
            if (result === null) {
                let error = new Error(`Error finding/deleting player [${token.platformDisplayName}]`);
                error.status = 404;
                next(error);
            } else {
                res.json(result._doc);
            }
        });
});

module.exports = {
    router,
    path: 'players'
};