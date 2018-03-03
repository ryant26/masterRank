const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');

let server = require('../../src/app');

chai.use(chaiHttp);

describe('Health Tests', function() {
    describe('/health', function () {
        it('should return a json object with a healthy property', function () {
            return chai.request(server)
                .get('/api/health')
                .then((result) => {
                    assert.equal(result.body.healthy, true);
                });
        });
    });
});