const chai = require('chai').assert;
const chaiHttp = require('chai-http');

let server = require('../../../app.js');

chai.use(chaiHttp);

describe('emailController', function() {
    beforeEach(function() {
        db.Email.destroy({
            where: {},
            truncate: true
        })
    });


    describe('/emnail', function() {
        it('shiould acceot well formed emails in the body', function () {
            return chai.request(server)
                .post('/email').then((result) => {
                    console.log(result);
                });
        });
    })
});
