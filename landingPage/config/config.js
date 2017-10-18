var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'landingpage'
    },
    port: process.env.PORT || 3000,
    db: 'postgres://localhost/landingpage-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'landingpage'
    },
    port: process.env.PORT || 3000,
    db: 'postgres://localhost/landingpage-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'landingpage'
    },
    port: process.env.PORT || 3000,
    db: 'postgres://localhost/landingpage-production'
  }
};

module.exports = config[env];
