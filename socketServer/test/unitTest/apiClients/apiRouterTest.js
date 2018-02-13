const apiRouter = require('../../../src/apiClients/apiRouter');
const chai = require('chai');
const assert = chai.assert;

describe('apiRouter', function() {
    it('should return a path with the port when provided', function() {
        let path = apiRouter.getEndpoint('localhost', 8080, '/api/endpoint');
        assert.equal(path, 'localhost:8080/api/endpoint');
    });

    it('should return a path without the port when not provided', function() {
        let path = apiRouter.getEndpoint('localhost', null, '/api/endpoint');
        assert.equal(path, 'localhost/api/endpoint');
    });
});