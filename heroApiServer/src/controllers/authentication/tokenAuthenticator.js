const router = require('express').Router();
const stringValidator = require('../../validators/stringValidator').allValidators;
const authenticationService = require('../../services/authenticationService');

router.post('/token/validate', function(req, res, next) {
    if (!req.body
        || !req.body.token
        || !stringValidator(req.body.token)) {
        let error = new Error('Missing or malformed body');
        error.status = 400;
        next(error);
    }
    next();
});

router.post('/token/validate', authenticationService.validateTokenFromBody, function (req, res) {
    res.json({scopes: req.user.scopes});
});

module.exports = router;
