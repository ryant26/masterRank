const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');

const platformDisplayName = 'PwNShoPP#1662';

let server = require('../../src/app');
let searchUrl = '/api/players/search';

chai.use(chaiHttp);

describe('Player Tests', function() {
    this.timeout(10000);

    describe('Search', function () {
        it('should return valid object with valid platformDisplayName', function() {
            return chai.request(server)
                .get(searchUrl)
                .query({platformDisplayName: platformDisplayName})
                .then((res) => {
                    assert.lengthOf(res.body, 1);
                    assert.equal(res.body[0].displayName, platformDisplayName);
                });
        });

        it('should have status of 400 when query param is not supplied', function() {
            return chai.request(server)
                .get(searchUrl)
                .catch((err) => {
                    assert.equal(err.status, 400);
                    assert.equal(err.response.body.message, 'Missing or malformed query parameter');
                });
        });

        it('should filter by region', function() {
            return chai.request(server)
                .get(searchUrl)
                .query({platformDisplayName: platformDisplayName, region: 'us'})
                .then((res) => {
                    assert.lengthOf(res.body, 1);
                    assert.equal(res.body[0].displayName, platformDisplayName);
                });
        });

        it('should filter by region (exclude)', function() {
            return chai.request(server)
                .get(searchUrl)
                .query({platformDisplayName: platformDisplayName, region: 'apac'})
                .then((res) => {
                    assert.lengthOf(res.body, 0);
                });
        });

        it('should filter by platform', function() {
            return chai.request(server)
                .get(searchUrl)
                .query({platformDisplayName: platformDisplayName, platform: 'pc'})
                .then((res) => {
                    assert.lengthOf(res.body, 1);
                    assert.equal(res.body[0].displayName, platformDisplayName);
                });
        });

        it('should filter by platform (exclude)', function() {
            return chai.request(server)
                .get(searchUrl)
                .query({platformDisplayName: platformDisplayName, platform: 'xbl'})
                .then((res) => {
                    assert.lengthOf(res.body, 0);
                });
        });
    });
});