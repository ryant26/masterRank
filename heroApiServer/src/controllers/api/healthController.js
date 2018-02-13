const express = require('express');
const router = express.Router();


router.get('', function(req, res) {
    return res.json({
        healthy: true
    });
});

module.exports = {
    router,
    path: 'health'
};