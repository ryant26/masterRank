const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');

const platformDisplayName = 'PwNShoPP#1662';
const region = 'us';
const platform = 'pc';

let server = require('../../src/app');
let playerUrl = '/api/players';
let searchUrl = `${playerUrl}/search`;

chai.use(chaiHttp);

describe('Player Tests', function() {
    this.timeout(20000);

    describe('Players/Search', function () {
        it('should return valid object with valid platformDisplayName', function() {
            return chai.request(server)
                .get(searchUrl)
                .query({platformDisplayName: platformDisplayName})
                .then((res) => {
                    assert.lengthOf(res.body, 1);
                    assert.equal(res.body[0].platformDisplayName, platformDisplayName);
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

        it('should filter by platform', function() {
            return chai.request(server)
                .get(searchUrl)
                .query({platformDisplayName: platformDisplayName, platform: 'pc'})
                .then((res) => {
                    assert.lengthOf(res.body, 1);
                    assert.equal(res.body[0].platformDisplayName, platformDisplayName);
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

    describe('Players', function () {
        it('should return valid object with valid platformDisplayName', function() {
            return chai.request(server)
                .get(playerUrl)
                .query({platformDisplayName, region, platform})
                .then((res) => {
                    assert.equal(res.body.platformDisplayName, platformDisplayName);
                });
        });

        it('should have status of 400 when query params are not supplied', function() {
            return chai.request(server)
                .get(searchUrl)
                .catch((err) => {
                    assert.equal(err.status, 400);
                    assert.equal(err.response.body.message, 'Missing or malformed query parameter');
                });
        });

        it('should filter by platform', function() {
            return chai.request(server)
                .get(playerUrl)
                .query({platformDisplayName, region,  platform: 'xbl'})
                .then(() => {
                    throw new Error('Hero should not have been found');
                }).catch((err) => {
                    assert.equal(err.status, 404);
                    assert.equal(err.response.body.message, 'Player could not be found');
                });
        });
    });
});