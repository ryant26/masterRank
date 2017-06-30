let chai = require('chai');
let assert = chai.assert;
let randomString = require('randomstring');
let logger = require('winston');
let sinon = require('sinon');
let RedisClient = require('../../../src/apiClients/RedisClient');

describe('addHero', function() {

    it('should create a new object for new users', function() {
        let id = '1234';
        return RedisClient.addHero(id, 'hero')
            .then(() => {
                return RedisClient.getPlayerHeros(id);
            })
            .then((heros) => {
                assert.lengthOf(heros, 1);
                assert.equal(heros[0].hero, 'hero');
            });
    });

    it('should add heros to exiting players', function() {
        let id = randomString.generate();

        let hero1 = 'hero1';
        let hero2 = 'hero2';
        return Promise.all([RedisClient.addHero(id, hero1), RedisClient.addHero(id, hero2)])
            .then(() => {
                return RedisClient.getPlayerHeros(id);
            })
            .then((heros) => {
                assert.lengthOf(heros, 2);
            });
    });

    it('should not add duplicates to the list', function() {
        let id = randomString.generate();

        let hero1 = 'hero1';
        return Promise.all([RedisClient.addHero(id, hero1), RedisClient.addHero(id, hero1)])
            .then(() => {
                return RedisClient.getPlayerHeros(id);
            })
            .then((heros) => {
                assert.lengthOf(heros, 1);
            });
    });
});

describe('removeHero', function() {

    it('should remove a hero from anywhere in the list', function() {
        let id = randomString.generate();

        let hero1 = 'hero1';
        return Promise.all([RedisClient.addHero(id, randomString.generate()), RedisClient.addHero(id, hero1), RedisClient.addHero(id, randomString.generate())])
            .then(() => {
                return RedisClient.removeHero(id, hero1);
            })
            .then(() => {
                return RedisClient.getPlayerHeros(id);
            })
            .then((heros) => {
                assert.lengthOf(heros, 2);
            });
    });

    it('should log a warning for a hero that doesnt exist', function() {
        let id = randomString.generate();

        let hero1 = 'hero1';
        sinon.spy(logger, 'warn');
        return RedisClient.removeHero(id, hero1)
            .then(() => {
                assert(logger.warn.calledOnce);
                logger.warn.restore();
            });
    });
});

describe('Player Info', function() {

    it('should store an object passed', function() {
        let id = randomString.generate();
        let someObj = {
            hello: 'world'
        };
        return RedisClient.addPlayerInfo(id, someObj).then(() => {
            return RedisClient.getPlayerInfo(id);
        }).then((data) => {
            assert.deepEqual(data, someObj);
        });
    });

    it('should return null if player does not exist', function() {
        return RedisClient.getPlayerInfo(randomString.generate()).then((data) => {
            assert.isNull(data);
        });
    });

    it('should be able to delete player info', function() {
        let id = randomString.generate();
        return RedisClient.addPlayerInfo(id, {hello: 'world'}).then(() => {
            return RedisClient.deletePlayerInfo(id);
        }).then(() => {
            return RedisClient.getPlayerInfo(id);
        }).then((data) => {
            assert.isNull(data);
        });
    });
});