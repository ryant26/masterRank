const express = require('express');
const glob = require('glob');
const mongoose = require('mongoose');
const logger = require('winston');
const config =require('config');
const path = require('path');
const rootPath = path.normalize(__dirname + '/..');

const dbPath = config.get('db');
const port = config.get('port');


mongoose.connect(dbPath);
let db = mongoose.connection;

db.on('error', function () {
    throw new Error('unable to connect to database at ' + dbPath);
});

let models = glob.sync(rootPath + '/src/models/*.js');
models.forEach(function (model) {
    require(model);
});

let app = express();

module.exports = require('./../config/express')(app);

app.listen(port, function () {
    logger.info('Express server listening on port ' + port);
});