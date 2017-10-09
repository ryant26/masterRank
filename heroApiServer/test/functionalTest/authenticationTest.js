const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const config = require('config');
const clientId = config.get('bnet.id');

let server = require('../../src/app');

chai.use(chaiHttp);

let testBnetRegion = function(region, done) {
    chai.request(server)
        .get('/auth/bnet')
        .query({region: region})
        .redirects(0)
        .then(Promise.reject)
        .catch((err) => {
            assert.equal(err.response.status, 302);
            assert.equal(err.response.headers.location, `https://${region}.battle.net/oauth/authorize?response_type=code&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fauth%2Fbnet%2Fcallback%3Fregion%3D${region}&client_id=${clientId}`);
            done();
        });
};

describe('Authentication Tests', function() {
    describe('BattleNet', function () {
        describe('Region specific requests should route to the correct OAuth region', function() {
            it('US', function(done) {
                testBnetRegion('us', done);
            });

            it('EU', function(done) {
                testBnetRegion('eu', done);
            });

            it('APAC', function(done) {
                testBnetRegion('apac', done);
            });
        });
    });
});