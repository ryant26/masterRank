const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const tokenUtil = require('../../devTools/tokenHelpers');

const platformDisplayName = 'iddqd#2884';
const region = 'us';
const platform = 'pc';
const heroName = 'brigitte';
const filterBy = 'top';
const limit = 5;

let server = require('../../src/app');

chai.use(chaiHttp);

describe('Hero Tests', function() {
    this.timeout(20000);
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

        it('should have status of 400 when an invalid heroname is passed', function() {
            return chai.request(server)
                .get('/api/heros/notARealName')
                .set('authorization', authHeader)
                .query({platformDisplayName, region,  platform})
                .then(() => {
                    throw new Error('Should have been BAD REQUEST');
                })
                .catch((err) => {
                    assert.equal(err.status, 400);
                    assert.equal(err.response.body.message, 'Invalid hero name');
                });
        });

        it('should return a hero on valid request', function () {
            return chai.request(server)
                .get(`/api/heros/${heroName}`)
                .set('authorization', authHeader)
                .query({platformDisplayName, region,  platform})
                .then((result) => {
                    assert.equal(result.body.heroName, heroName);
                    assert.equal(result.body.platformDisplayName, platformDisplayName);
                    assert.isObject(result.body.stats);
                });
        });

        it('should return a null stats field when stats are unavailable', function () {
            return chai.request(server)
                .get('/api/heros/torbjorn')
                .set('authorization', authHeader)
                .query({platformDisplayName, region,  platform})
                .then((result) => {
                    assert.equal(result.body.heroName, 'torbjorn');
                    assert.equal(result.body.platformDisplayName, platformDisplayName);
                    assert.isNull(result.body.stats);
                });
        });
    });

    describe('/heros/:heroName', function () {
        it('should return 401 if no token is in req', function() {
            return chai.request(server)
                .get('/api/heros')
                .query({platformDisplayName, region,  platform, filterBy, limit})
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
                .get('/api/heros')
                .set('authorization', authHeader)
                .then(() => {
                    throw new Error('Should have been BAD REQUEST');
                })
                .catch((err) => {
                    assert.equal(err.status, 400);
                    assert.equal(err.response.body.message, 'Missing or malformed query parameter');
                });
        });

        it('should have status of 400 when an invalid filterBy is passed', function() {
            return chai.request(server)
                .get('/api/heros')
                .set('authorization', authHeader)
                .query({platformDisplayName, region,  platform, limit, filterBy: 'bottom'})
                .then(() => {
                    throw new Error('Should have been BAD REQUEST');
                })
                .catch((err) => {
                    assert.equal(err.status, 400);
                    assert.equal(err.response.body.message, 'Missing or malformed query parameter');
                });
        });

        it('should have status of 400 when an invalid limit is passed', function() {
            return chai.request(server)
                .get('/api/heros')
                .set('authorization', authHeader)
                .query({platformDisplayName, region,  platform, filterBy, limit: 0})
                .then(() => {
                    throw new Error('Should have been BAD REQUEST');
                })
                .catch((err) => {
                    assert.equal(err.status, 400);
                    assert.equal(err.response.body.message, 'Missing or malformed query parameter');
                });
        });

        it('should have status of 400 when an invalid limit is passed', function() {
            return chai.request(server)
                .get('/api/heros')
                .set('authorization', authHeader)
                .query({platformDisplayName, region,  platform, filterBy, limit: 51})
                .then(() => {
                    throw new Error('Should have been BAD REQUEST');
                })
                .catch((err) => {
                    assert.equal(err.status, 400);
                    assert.equal(err.response.body.message, 'Missing or malformed query parameter');
                });
        });

        it('should return an array of heroes on valid request', function () {
            return chai.request(server)
                .get('/api/heros')
                .set('authorization', authHeader)
                .query({platformDisplayName, region,  platform, filterBy, limit})
                .then((result) => {
                    assert.isArray(result.body);
                });
        });
    });

    describe('/heros/remove', function() {
        it('should have a status of 401 when auth token is not supplied', function() {
            return chai.request(server)
                .get('/api/heros/remove')
                .catch((err) => {
                    assert.equal(err.status, 401);
                    assert.equal(err.response.body.message, 'No authorization token was found');
                });
        });

        it('should return 401 when valid token passed but is expired', () => {
            let expiredToken = tokenUtil.getExpiredToken();
            let authHeader = `Bearer ${expiredToken}`;
            return chai.request(server)
                .get('/api/heros/remove')
                .set('authorization', authHeader)
                .catch((err) => {
                    assert.equal(err.status, 401);
                    assert.equal(err.response.body.message, 'jwt expired');
                });
        });

        it('should return 401 when valid token passed but signed with wrong secret', () => {
            let wrongToken = tokenUtil.getTokenSignedWithOldSecret();
            let authHeader = `Bearer ${wrongToken}`;
            return chai.request(server)
                .get('/api/heros/remove')
                .set('authorization', authHeader)
                .catch((err) => {
                    assert.equal(err.status, 401);
                    assert.equal(err.response.body.message, 'invalid signature');
                });
        });

        it('should return valid object with deleted string assigned to action', function() {
            return chai.request(server)
                .get('/api/heros/remove')
                .set('authorization', authHeader)
                .then((result) => {
                    assert.equal(result.status, 200);
                    assert.equal(result.body.action, 'deleted');
                });
        });
    });
});