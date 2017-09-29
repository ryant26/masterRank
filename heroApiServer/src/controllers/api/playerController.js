const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Player = mongoose.model('Player');

router.get('/search/players', function (req, res, next) {
    Player.find(function (err, articles) {
        if (err) return next(err);
        res.json(articles);
    });
});

module.exports = router;