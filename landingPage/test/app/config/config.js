'use strict';

var expect = require('chai').expect;

var config = require('../../../config/config');

describe('config', function() {
  it('should load', function() {
    expect(process.env.NODE_ENV).to.eql('test');

    expect(config).to.eql({
      root: config.root,
      app: {
        name: 'landingpage'
      },
      port: process.env.PORT || 3000,
      db: 'sqlite://localhost/landingpage-test',
      storage: config.storage
    });
  });
});
