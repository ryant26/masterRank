import Websocket from './websocket';
import token from '../resources/token';

describe('Websocket API', () => {
    let websocket;

    beforeEach(() => {
        websocket = new Websocket(token);
    });

    afterEach(() => {
        websocket.disconnect();
    });

    describe('addHero', () => {
        it('should emit the addHero event', (done) => {
            let heroName = 'soldier76';
            let preference = 1;
            websocket.socket.emit = function(event, heroData) {
                expect(event).toEqual('addHero');
                expect(heroData).toEqual({heroName, priority: preference});
                done();
            };
            websocket.addHero(heroName, preference);
        });
    });

    describe('groupInviteSend', () => {
        it('should emit the groupInviteSend event', (done) => {
            const user = {
                "battleNetId": 'PwNShoPP#1662',
                "heroName": 'genji'
            };
            websocket.socket.emit = function(event, userData) {
                expect(event).toEqual('groupInviteSend');
                expect(userData).toEqual(user);
                done();
            };
            websocket.groupInviteSend(user);
        });
    });

    describe('createGroup', () => {
        it('should emit the createGroup event', (done) => {
            const heroName = 'genji';
            websocket.socket.emit = function(event, groupData) {
                expect(event).toEqual('createGroup');
                expect(groupData).toEqual({heroName});
                done();
            };
            websocket.createGroup(heroName);
        });
    });

    describe('groupLeave', () => {
        it('should emit the groupLeave event', (done) => {
            const groupId = 10;
            websocket.socket.emit = function(event, groupInfo) {
                expect(event).toEqual('groupLeave');
                expect(groupInfo).toEqual(groupId);
                done();
            };
            websocket.groupLeave(groupId);
        });
    });

    describe('groupInviteCancel', () => {
        it('should emit the groupInviteCancel event', (done) => {
            const user = {
                "battleNetId": 'PwNShoPP#1662',
                "heroName": 'genji'
            };
            websocket.socket.emit = function(event, userData) {
                expect(event).toEqual('groupInviteCancel');
                expect(userData).toEqual(user);
                done();
            };
            websocket.groupInviteCancel(user);
        });
    });
});
