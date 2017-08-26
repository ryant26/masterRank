const express = require('express');
const config = require('./../config/config');
const glob = require('glob');
const mongoose = require('mongoose');
const logger = require('winston');

mongoose.connect(config.db);
let db = mongoose.connection;
db.on('error', function () {
    throw new Error('unable to connect to database at ' + config.db);
});

let models = glob.sync(config.root + '/src/models/*.js');
models.forEach(function (model) {
    require(model);
});
let app = express();

module.exports = require('./../config/express')(app, config);

app.listen(config.port, function () {
    logger.info('Express server listening on port ' + config.port);
});

