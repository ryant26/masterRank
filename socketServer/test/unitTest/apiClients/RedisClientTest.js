let chai = require('chai');
let assert = chai.assert;
let randomString = require('randomstring');
let logger = require('winston');
let sinon = require('sinon');
let RedisClient = require('../../../src/apiClients/RedisClient');

let getHeroObject = function (name) {
    return {
        heroName: name,
        stats:{}
    };
};

describe('addPlayerHero', function() {

    it('should create a new object for new users', function() {
        let id = '1234';
        return RedisClient.addPlayerHero(id, getHeroObject('hero'))
            .then(() => {
                return RedisClient.getPlayerHeros(id);
            })
            .then((heros) => {
                assert.lengthOf(heros, 1);
                assert.equal(heros[0].heroName, 'hero');
            });
    });

    it('should add heros to exiting players', function() {
        let id = randomString.generate();

        let hero1 = 'hero1';
        let hero2 = 'hero2';
        return Promise.all([RedisClient.addPlayerHero(id, getHeroObject(hero1)), RedisClient.addPlayerHero(id, getHeroObject(hero2))])
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
        return Promise.all([RedisClient.addPlayerHero(id, getHeroObject(hero1)), RedisClient.addPlayerHero(id, getHeroObject(hero1))])
            .then(() => {
                return RedisClient.getPlayerHeros(id);
            })
            .then((heros) => {
                assert.lengthOf(heros, 1);
            });
    });
});

describe('removePlayerHeroByName', function() {

    it('should remove a hero from anywhere in the list', function() {
        let id = randomString.generate();

        let hero1 = 'hero1';
        return Promise.all([RedisClient.addPlayerHero(id, getHeroObject(hero1)),
            RedisClient.addPlayerHero(id, getHeroObject(randomString.generate())),
            RedisClient.addPlayerHero(id, getHeroObject(randomString.generate()))])
            .then(() => {
                return RedisClient.removePlayerHeroByName(id, hero1);
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
        return RedisClient.removePlayerHeroByName(id, hero1)
            .then(() => {
                assert(logger.warn.calledOnce);
                logger.warn.restore();
            });
    });
});

describe('addMetaHero', function() {
    let rank;
    let region;

    beforeEach(function() {
        rank = randomString.generate();
        region = randomString.generate();
    });

    it('should add a hero to the new meta list', function() {
        let hero = getHeroObject('Mei');
        return RedisClient.addMetaHero(rank, region, hero).then(() => {
            return RedisClient.getMetaHeros(rank, region);
        }).then((heros) => {
            assert.lengthOf(heros, 1);
            assert.deepEqual(heros[0], hero);
        });
    });

    it('should append heros to the existing meta list', function() {
        let hero1 = getHeroObject('Mei');
        let hero2 =getHeroObject('widow');
        return Promise.all([RedisClient.addMetaHero(rank, region, hero1), RedisClient.addMetaHero(rank, region, hero2)]).then(() => {
            return RedisClient.getMetaHeros(rank, region);
        }).then((heros) => {
            assert.lengthOf(heros, 2);
        });
    });

    it('should not append duplicates to existing meta list', function() {
        let hero = getHeroObject('Mei');
        return Promise.all([RedisClient.addMetaHero(rank, region, hero), RedisClient.addMetaHero(rank, region, hero)]).then(() => {
            return RedisClient.getMetaHeros(rank, region);
        }).then((heros) => {
            assert.lengthOf(heros, 1);
        });
    });

    it('should add heros from separate ranks to separate lists', function() {
        let rank2 = randomString.generate();
        let hero = getHeroObject('Mei');
        return Promise.all([RedisClient.addMetaHero(rank, region, hero), RedisClient.addMetaHero(rank2, region, hero)]).then(() => {
            return RedisClient.getMetaHeros(rank, region);
        }).then((heros) => {
            assert.lengthOf(heros, 1);
            return RedisClient.getMetaHeros(rank2, region);
        }).then((heros) => {
            assert.lengthOf(heros, 1);
        });
    });

    it('should add heros from separate regions to separate lists', function() {
        let region2 = randomString.generate();
        let hero = getHeroObject('Mei');
        return Promise.all([RedisClient.addMetaHero(rank, region, hero), RedisClient.addMetaHero(rank, region2, hero)]).then(() => {
            return RedisClient.getMetaHeros(rank, region);
        }).then((heros) => {
            assert.lengthOf(heros, 1);
            return RedisClient.getMetaHeros(rank, region2);
        }).then((heros) => {
            assert.lengthOf(heros, 1);
        });
    });
});

describe('removeMetaHero', function() {
    let rank;
    let region;

    beforeEach(function() {
        rank = randomString.generate();
        region = randomString.generate();
    });

    it('should remove a single hero from the list', function() {
        let hero = getHeroObject('Mei');
        return RedisClient.addMetaHero(rank, region, hero).then(() => {
            return RedisClient.removeMetaHero(rank, region, hero);
        }).then(() => {
            return RedisClient.getMetaHeros(rank, region);
        }).then((heros) => {
            assert.isEmpty(heros);
        });
    });

    it('should remove hero for only 1 rank and region', function() {
        let rank2 = randomString.generate();
        let hero = getHeroObject('Mei');
        return Promise.all([RedisClient.addMetaHero(rank, region, hero), RedisClient.addMetaHero(rank2, region, hero)]).then(() => {
            return RedisClient.removeMetaHero(rank, region, hero);
        }).then(() => {
            return RedisClient.getMetaHeros(rank, region);
        }).then((heros) => {
            assert.isEmpty(heros);
            return RedisClient.getMetaHeros(rank2, region);
        }).then((heros) => {
            assert.lengthOf(heros, 1);
        });
    });

    it('should log a warning when trying to remove a hero that does not exist', function() {
        let hero = getHeroObject('Mei');
        sinon.spy(logger, 'warn');
        return RedisClient.addMetaHero(rank, region, hero).then(() => {
            return RedisClient.removeMetaHero(rank, region, {battleNetId: randomString.generate(), heroName: 'Genji'});
        }).then(() => {
            assert(logger.warn.calledOnce);
            logger.warn.restore();
        });
    });
});

describe('getMetaHeros', function() {
    let rank;
    let region;

    beforeEach(function() {
        rank = randomString.generate();
        region = randomString.generate();
    });

    it('should return an empty list if the rank/region is empty', function() {
        return RedisClient.getMetaHeros(rank, region).then((heros) => {
            assert.isArray(heros);
            assert.isEmpty(heros);
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