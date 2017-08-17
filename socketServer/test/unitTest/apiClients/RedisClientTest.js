const chai = require('chai');
const assert = chai.assert;
const randomString = require('randomstring');
const logger = require('winston');
const sinon = require('sinon');
const RedisClient = require('../../../src/apiClients/RedisClient');

let getHeroObject = function (name) {
    return {
        heroName: name,
        stats:{}
    };
};

describe('RedisClient Tests', function() {
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

    describe('removePlayerHeros', function() {

        it('should remove a hero from anywhere in the list', function() {
            let id = randomString.generate();

            let hero1 = getHeroObject('hero1');
            return Promise.all([RedisClient.addPlayerHero(id, hero1),
                RedisClient.addPlayerHero(id, getHeroObject(randomString.generate())),
                RedisClient.addPlayerHero(id, getHeroObject(randomString.generate()))])
                .then(() => {
                    return RedisClient.removePlayerHeros(id, hero1);
                })
                .then(() => {
                    return RedisClient.getPlayerHeros(id);
                })
                .then((heros) => {
                    assert.lengthOf(heros, 2);
                });
        });

        it('should be able to remove multple heros at once', function() {
            let id = randomString.generate();

            let hero1 = getHeroObject(randomString.generate());
            let hero2 = getHeroObject(randomString.generate());
            let hero3 = getHeroObject(randomString.generate());
            return Promise.all([RedisClient.addPlayerHero(id, hero1),
                RedisClient.addPlayerHero(id, hero2),
                RedisClient.addPlayerHero(id, hero3)])
                .then(() => {
                    return RedisClient.removePlayerHeros(id, hero1, hero2, hero3);
                })
                .then(() => {
                    return RedisClient.getPlayerHeros(id);
                })
                .then((heros) => {
                    assert.isEmpty(heros);
                });
        });

        it('should log a warning for a hero that doesnt exist', function() {
            let id = randomString.generate();

            let hero1 = getHeroObject(randomString.generate());
            sinon.spy(logger, 'warn');
            return RedisClient.removePlayerHeros(id, hero1)
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

    describe('removeMetaHeros', function() {
        let rank;
        let region;

        beforeEach(function() {
            rank = randomString.generate();
            region = randomString.generate();
        });

        it('should remove a single hero from the list', function() {
            let hero = getHeroObject('Mei');
            return RedisClient.addMetaHero(rank, region, hero).then(() => {
                return RedisClient.removeMetaHeros(rank, region, hero);
            }).then(() => {
                return RedisClient.getMetaHeros(rank, region);
            }).then((heros) => {
                assert.isEmpty(heros);
            });
        });

        it('should remove a multiple heros from the list when passed', function() {
            let hero = getHeroObject(randomString.generate());
            let hero2 = getHeroObject(randomString.generate());
            let hero3 = getHeroObject(randomString.generate());

            Promise.all([RedisClient.addMetaHero(rank, region, hero), RedisClient.addMetaHero(rank, region, hero2), RedisClient.addMetaHero(rank, region, hero3)])
                .then(() => {
                    return RedisClient.removeMetaHeros(rank, region, hero, hero2, hero3);
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
                return RedisClient.removeMetaHeros(rank, region, hero);
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
                return RedisClient.removeMetaHeros(rank, region, {battleNetId: randomString.generate(), heroName: 'Genji'});
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

    describe('setGroupLeader', function() {
        let groupId;

        beforeEach(function() {
            return RedisClient.createNewGroup().then((id) => {
                groupId = id;
            });
        });

        it('should set the group leader', function() {
            let battleNetId = randomString.generate();
            return RedisClient.setGroupLeader(groupId, battleNetId).then(() => {
                return RedisClient.getGroupDetails(groupId);
            }).then((groupDetails) => {
                assert.equal(groupDetails.leader, battleNetId);
            });
        });

        it('should overwrite the current leader', function() {
            let battleNetId = randomString.generate();
            return RedisClient.setGroupLeader(groupId, randomString.generate()).then(() => {
                return RedisClient.setGroupLeader(groupId, battleNetId);
            }).then(() => {
                return RedisClient.getGroupDetails(groupId);
            }).then((groupDetails) => {
                assert.equal(groupDetails.leader, battleNetId);
            });
        });
    });

    describe('addHeroToGroupPending', function() {

        let groupId;
        let hero;

        beforeEach(function() {
            hero = getHeroObject(randomString.generate());
            return RedisClient.createNewGroup().then((id) => {
                groupId = id;
            });
        });

        it('should create the pending list if it doesnt exist already', function() {
            return RedisClient.addHeroToGroupPending(groupId, hero).then(() => {
                return RedisClient.getGroupDetails(groupId);
            }).then((details) => {
                assert.lengthOf(details.pending, 1);
                assert.deepEqual(details.pending[0], hero);
            });
        });

        it('should add a user to the pending list if it already exists', function() {
            let hero2 = getHeroObject(randomString.generate());
            let addHero1 = RedisClient.addHeroToGroupPending(groupId, hero);
            let addHero2 = RedisClient.addHeroToGroupPending(groupId, hero2);
            return Promise.all([addHero1, addHero2]).then(() => {
                return RedisClient.getGroupDetails(groupId);
            }).then((details) => {
                assert.lengthOf(details.pending, 2);
            });
        });
    });

    describe('removeHeroFromGroupPending', function() {

        let groupId;
        let hero;

        beforeEach(function() {
            hero = getHeroObject(randomString.generate());
            return RedisClient.createNewGroup().then((id) => {
                groupId = id;
            });
        });

        it('should remove a hero from the list', function() {
            let hero2 = getHeroObject(randomString.generate());
            let hero3 = getHeroObject(randomString.generate());
            let addHero1 = RedisClient.addHeroToGroupPending(groupId, hero);
            let addHero2 = RedisClient.addHeroToGroupPending(groupId, hero2);
            let addHero3 = RedisClient.addHeroToGroupPending(groupId, hero3);

            return Promise.all([addHero1, addHero2, addHero3]).then(() => {
                return RedisClient.removeHeroFromGroupPending(groupId, hero);
            }).then(() => {
                return RedisClient.getGroupDetails(groupId);
            }).then((details) => {
                assert.lengthOf(details.pending, 2);
            });
        });
    });

    describe('addHeroToGroupMembers', function() {

        let groupId;
        let hero;

        beforeEach(function() {
            hero = getHeroObject(randomString.generate());
            return RedisClient.createNewGroup().then((id) => {
                groupId = id;
            });
        });

        it('should create the pending list if it doesnt exist already', function() {
            return RedisClient.addHeroToGroupMembers(groupId, hero).then(() => {
                return RedisClient.getGroupDetails(groupId);
            }).then((details) => {
                assert.lengthOf(details.members, 1);
                assert.deepEqual(details.members[0], hero);
            });
        });

        it('should add a user to the pending list if it already exists', function() {
            let hero2 = getHeroObject(randomString.generate());
            let addHero1 = RedisClient.addHeroToGroupMembers(groupId, hero);
            let addHero2 = RedisClient.addHeroToGroupMembers(groupId, hero2);
            return Promise.all([addHero1, addHero2]).then(() => {
                return RedisClient.getGroupDetails(groupId);
            }).then((details) => {
                assert.lengthOf(details.members, 2);
            });
        });
    });

    describe('removeHeroFromGroupPending', function() {

        let groupId;
        let hero;

        beforeEach(function() {
            hero = getHeroObject(randomString.generate());
            return RedisClient.createNewGroup().then((id) => {
                groupId = id;
            });
        });

        it('should remove a hero from the list', function() {
            let hero2 = getHeroObject(randomString.generate());
            let hero3 = getHeroObject(randomString.generate());
            let addHero1 = RedisClient.addHeroToGroupMembers(groupId, hero);
            let addHero2 = RedisClient.addHeroToGroupMembers(groupId, hero2);
            let addHero3 = RedisClient.addHeroToGroupMembers(groupId, hero3);

            return Promise.all([addHero1, addHero2, addHero3]).then(() => {
                return RedisClient.removeHeroFromGroupMembers(groupId, hero);
            }).then(() => {
                return RedisClient.getGroupDetails(groupId);
            }).then((details) => {
                assert.lengthOf(details.members, 2);
                assert.notDeepInclude(details.members, hero);
            });
        });
    });

    describe('deleteGroup', function() {
        let groupId;
        let hero;

        beforeEach(function() {
            hero = getHeroObject(randomString.generate());
            return RedisClient.createNewGroup().then((id) => {
                groupId = id;
            });
        });

        it('should remove the group leader', function() {
            return RedisClient.setGroupLeader(groupId, hero).then(() => {
                return RedisClient.deleteGroup(groupId);
            }).then(() => {
                return RedisClient.getGroupDetails(groupId);
            }).then((details) => {
                assert.isNull(details.leader);
            });
        });

        it('should remove the group members', function() {
            return RedisClient.addHeroToGroupMembers(groupId, hero).then(() => {
                return RedisClient.deleteGroup(groupId);
            }).then(() => {
                return RedisClient.getGroupDetails(groupId);
            }).then((details) => {
                assert.lengthOf(details.members, 0);
            });
        });

        it('should remove the group pending', function() {
            return RedisClient.addHeroToGroupPending(groupId, hero).then(() => {
                return RedisClient.deleteGroup(groupId);
            }).then(() => {
                return RedisClient.getGroupDetails(groupId);
            }).then((details) => {
                assert.lengthOf(details.pending, 0);
            });
        });
    });
});
