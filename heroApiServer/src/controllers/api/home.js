// *************************
// *************************
// *************************
// For example purposes only
// *************************
// *************************
// *************************
const express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Article = mongoose.model('Article');

router.get('/', function (req, res, next) {
    Article.find(function (err, articles) {
        if (err) return next(err);
        res.json(articles);
    });
});

module.exports = router;