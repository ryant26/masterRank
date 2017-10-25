const express = require('express');
const config = require('config');
const db = require('./src/models');

const port = config.get('app.port');

var app = express();

module.exports = require('./config/express')(app);

db.sequelize
  .sync()
  .then(function () {
    if (!module.parent) {
      app.listen(port, function () {
        console.log('Express server listening on port ' + port);
      });
    }
  }).catch(function (e) {
    throw new Error(e);
  });

