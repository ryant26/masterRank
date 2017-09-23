const glob = require('glob');
const logger = require('morgan');
const config = require('config');
const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const passport = require('passport');

module.exports = function(app) {
    app.use(logger(config.get('loggingLevel')));

    app.use(passport.initialize());

    let apiControllers = glob.sync(rootPath + '/src/controllers/api/*.js');
    apiControllers.forEach(function (controller) {
        app.use('/api', require(controller));
    });

    let authenticationControllers = glob.sync(rootPath + '/src/controllers/authentication/*.js');
    authenticationControllers.forEach(function (controller) {
        app.use('/auth', require(controller));
    });

    app.use(function (req, res, next) {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    if(app.get('env') === 'develop'){
        app.use(function (err, req, res) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err,
                title: 'error'
            });
        });
    }

    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {},
            title: 'error'
        });
    });

    return app;
};
