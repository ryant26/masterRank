const chai = require('chai');
const assert = chai.assert;
const randomString = require('randomstring');
const GroupController = require('../../../src/controllers/GroupController');
const EventEmitter = require('events');
const sinon = require('sinon');
const logger = require('winston');
const redis = require('redis');

let groupService = require('../../../src/services/groupService');

describe('GroupController Tests', function() {
    let socket;

    beforeEach(function() {
        socket = new EventEmitter();
        socket.token = {
            battleNetId: randomString.generate()
        };
        socket.join = function(){};
    });

    after(function(done) {
        redis.createClient().flushall((err) => {
            if(err) {
                logger.error(err);
                done(err);
            }
            done();
        });
    });

    describe('groupId', function() {
        it('should attempt to retrieve the groupID on construction', function() {
            sinon.spy(groupService, 'getGroupId');
            new GroupController({socket});

            assert(groupService.getGroupId.calledWith(socket.token.battleNetId));

            groupService.getGroupId.restore();
        });

        it('should attempt to set the groupID in redis when the property is set', function() {
            let groupId = 10;
            sinon.spy(groupService, 'setGroupId');
            let controller = new GroupController({socket});
            controller.groupId = groupId;

            assert(groupService.setGroupId.calledWith(socket.token.battleNetId, groupId));

            groupService.setGroupId.restore();
        });

        it('should attempt to delete the groupID in redis when the property is set to null', function() {
            sinon.spy(groupService, 'deleteGroupId');
            let controller = new GroupController({socket});
            controller.groupId = null;

            assert(groupService.deleteGroupId.calledOnce);

            groupService.deleteGroupId.restore();
        });
    });
});