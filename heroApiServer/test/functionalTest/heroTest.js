const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const tokenUtil = require('../unitTest/commonUtils/tokenHelpers');

const platformDisplayName = 'PwNShoPP#1662';
const region = 'us';
const platform = 'pc';
const heroName = 'soldier76';

let server = require('../../src/app');

chai.use(chaiHttp);

describe('Hero Tests', function() {
    this.timeout(10000);
    let token = tokenUtil.getValidToken(platformDisplayName, region, platform);
    let authHeader = `Bearer ${token}`;

    describe('/heros/:heroName', function () {
        it('should return 401 if no token is in req', function() {
            return chai.request(server)
                .get('/api/heros/soldier76')
                .then(() => {
                    throw new Error('Should have been UNAUTHORIZED');
                })
                .catch((err) => {
                    assert.equal(err.status, 401);
                    assert.equal(err.message, 'Unauthorized');
                });
        });

        it('should have status of 400 when all query params are not supplied', function() {
            return chai.request(server)
                .get('/api/heros/soldier76')
                .set('authorization', authHeader)
                .then(() => {
                    throw new Error('Should have been BAD REQUEST');
                })
                .catch((err) => {
                    assert.equal(err.status, 400);
                    assert.equal(err.response.body.message, 'Missing or malformed query parameter');
                });
        });

        it('should return a hero on valid request', function () {

            return chai.request(server)
                .get(`/api/heros/${heroName}`)
                .set('authorization', authHeader)
                .query({platformDisplayName, region,  platform})
                .then((result) => {
                    assert.equal(result.body.heroName, heroName);
                    assert.equal(result.body.platform, platform);
                    assert.equal(result.body.region, region);
                    assert.equal(result.body.platformDisplayName, platformDisplayName);
                });
        });

        it('should filter by region', function() {
            return chai.request(server)
                .get(`/api/heros/${heroName}`)
                .set('authorization', authHeader)
                .query({platformDisplayName, region: 'apac',  platform})
                .then(() => {
                    throw new Error('Hero should not have been found');
                }).catch((err) => {
                    assert.equal(err.status, 404);
                    assert.equal(err.response.body.message, 'Hero could not be found');
                });
        });

        it('should filter by platform', function() {
            return chai.request(server)
                .get(`/api/heros/${heroName}`)
                .set('authorization', authHeader)
                .query({platformDisplayName, region,  platform: 'xbl'})
                .then(() => {
                    throw new Error('Hero should not have been found');
                }).catch((err) => {
                    assert.equal(err.status, 404);
                    assert.equal(err.response.body.message, 'Hero could not be found');
                });
        });
    });
});