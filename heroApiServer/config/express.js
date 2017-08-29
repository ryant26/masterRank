const glob = require('glob');
const logger = require('morgan');
const config = require('config');
const path = require('path');
const rootPath = path.normalize(__dirname + '/..');

module.exports = function(app) {
    app.use(logger(config.get('loggingLevel')));

    let controllers = glob.sync(rootPath + '/src/controllers/*.js');
    controllers.forEach(function (controller) {
        require(controller)(app);
    });

    app.use(function (req, res, next) {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    if(app.get('env') === 'develop'){
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err,
                title: 'error'
            });
        });
    }

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {},
            title: 'error'
        });
    });

    return app;
};
