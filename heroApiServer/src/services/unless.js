module.exports = function(path, middleware) {
    return function(req, res, next) {
        if (path === req.path) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};
// from https://stackoverflow.com/questions/27117337/exclude-route-from-express-middleware/27118077#27118077
