const emailValidator = require('email-validator');
const express = require('express');
const router = express.Router();
const db = require('../models');

module.exports = function (app) {
  app.use('/api', router);
};

router.post('/email', function(req, res, next) {
  if(emailValidator.validate(req.body.email)) {
    next()
  } else {
    let error = new Error('Invalid email address submitted');
    error.status = 400;
    next(error);
  }
});

router.post('/email', function (req, res, next) {
  db.Email.create({email: req.body.email}).then(function (email) {
    res.status(201).json({email: email.email});
  }).catch((err) => {
      let error;
      if(err.name && err.name === 'SequelizeUniqueConstraintError') {
          error = new Error('Duplicate entry');
          error.status = 409;
      } else {
          error = new Error('Internal Server Error');
          error.status = 500;
      }

      next(error);
  });
});
