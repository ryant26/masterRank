var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'heroapiserver'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/heroapiserver-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'heroapiserver'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/heroapiserver-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'heroapiserver'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/heroapiserver-production'
  }
};

module.exports = config[env];
