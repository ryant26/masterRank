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
    let token;

    beforeEach(function() {
        socket = new EventEmitter();
        token = {
            platformDisplayName: randomString.generate(),
            region: randomString.generate(),
            platform: 'pc'
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
            new GroupController({socket, token});

            assert(groupService.getGroupId.calledWith(token));

            groupService.getGroupId.restore();
        });

        it('should rejoin the socket to any existing group room on construction', function(done) {
            sinon.stub(groupService, 'getGroupId').resolves(1);
            sinon.spy(groupService, 'addSocketToGroupRoom');

            new GroupController({socket, token});

            setTimeout(() => {
                assert(groupService.addSocketToGroupRoom.calledWith(1 , socket));
                groupService.getGroupId.restore();
                groupService.addSocketToGroupRoom.restore();
                done();
            }, 100);
        });

        it('should not rejoin socket to any group rooms if the player is not part of a group', function() {
            sinon.spy(groupService, 'addSocketToGroupRoom');
            new GroupController({socket, token});
            assert.isFalse(groupService.addSocketToGroupRoom.called);
            groupService.addSocketToGroupRoom.restore();
        });

        it('should attempt to set the groupID in redis when the property is set', function() {
            let groupId = 10;
            sinon.spy(groupService, 'setGroupId');
            let controller = new GroupController({socket, token});
            controller.groupId = groupId;

            assert(groupService.setGroupId.calledWith(token, groupId));

            groupService.setGroupId.restore();
        });

        it('should attempt to delete the groupID in redis when the property is set to null', function() {
            sinon.spy(groupService, 'deleteGroupId');
            let controller = new GroupController({socket, token});
            controller.groupId = null;

            assert(groupService.deleteGroupId.calledOnce);

            groupService.deleteGroupId.restore();
        });
    });
});