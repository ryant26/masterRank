let chai = require('chai');
let assert = chai.assert;
let randomString = require('randomstring');
let RedisClient = require('../../../src/apiClients/RedisClient');

describe('addHero', function() {
    let client;

    before(function () {
        client = new RedisClient();
    });

    it('should create a new object for new users', function(done) {
        let id = '1234';
        client.addHero(id, 'hero')
            .then(() => {
                return client.getPlayerHeros(id);
            })
            .then((heros) => {
                assert.lengthOf(heros, 1);
                assert.equal(heros[0].hero, 'hero');
                done();
            });
    });

    it('should add heros to exiting players', function(done) {
        let id = randomString.generate();

        let hero1 = 'hero1';
        let hero2 = 'hero2';
        Promise.all([client.addHero(id, hero1), client.addHero(id, hero2)])
            .then(() => {
                return client.getPlayerHeros(id);
            })
            .then((heros) => {
                assert.lengthOf(heros, 2);
                done();
            });
    });

    it('should not add duplicates to the list', function(done) {
        let id = randomString.generate();

        let hero1 = 'hero1';
        Promise.all([client.addHero(id, hero1), client.addHero(id, hero1)])
            .then(() => {
                return client.getPlayerHeros(id);
            })
            .then((heros) => {
                assert.lengthOf(heros, 1);
                done();
            });
    });
});

describe('removeHero', function() {
    let client;

    before(function () {
        client = new RedisClient();
    });

    it('should remove a hero from anywhere in the list', function(done) {
        let id = randomString.generate();

        let hero1 = 'hero1';
        Promise.all([client.addHero(id, randomString.generate()), client.addHero(id, hero1), client.addHero(id, randomString.generate())])
            .then(() => {
                return client.removeHero(id, hero1);
            })
            .then(() => {
                return client.getPlayerHeros(id);
            })
            .then((heros) => {
                assert.lengthOf(heros, 2);
                done();
            });
    });
});