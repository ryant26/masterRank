const glob = require('glob');
const logger = require('morgan');
const logAggregator = require('../src/services/logger').sysLogger;
const config = require('config');
const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const passport = require('passport');
const bodyParser = require('body-parser');
const helmet = require('helmet');

module.exports = function(app) {

    app.use(helmet());

    app.set('trust proxy');

    app.use(logger(config.get('logFormat'), {stream: logAggregator.stream}));

    app.use(passport.initialize());

    app.use(bodyParser.json());

    let apiControllers = glob.sync(rootPath + '/src/controllers/api/*.js');
    apiControllers.forEach(function (controller) {
        let router = require(controller);
        app.use(`/api/${router.path}`, router.router);
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
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.json({
                message: err.message,
                error: err,
                title: 'error'
            });
        });
    }

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: {},
            title: 'error'
        });
    });

    return app;
};
