import model from './model';
import {createStore} from './store';
import {clientEvents} from '../api/websocket';

const mockSocket = require('socket-io-mock');
const names = require('../../../shared/allHeroNames').names;

import groupInvites from '../resources/groupInvites';

const token = {platformDisplayName: 'PwNShoPP', region: 'us', platform: 'pc'};
const initializeSocket = function() {
    let websocket = new mockSocket();
    websocket.addHero = jest.fn();
    websocket.removeHero = jest.fn();
    websocket.createGroup = jest.fn();
    websocket.groupInviteSend = jest.fn();
    websocket.groupLeave = jest.fn();
    websocket.groupInviteAccept = jest.fn();
    websocket.groupInviteCancel = jest.fn();
    websocket.groupInviteDecline = jest.fn();
    return websocket;
};

let generateHero = function(heroName='hero', platformDisplayName=token.platformDisplayName, preference=1) {
    return {platformDisplayName, heroName, preference};
};

let generateInvite = function(id=1, groupLeader='PwNShoPP') {
    return {id, groupLeader};
};

let generateUser = function(platformDisplayName=token.platformDisplayName, region=token.region, platform=token.platform) {
    return {platformDisplayName, region, platform};
};

describe('Model', () => {
    let store;
    let socket;

    beforeEach(() => {
        store = createStore();
        socket = initializeSocket();
        model.initialize(socket, store);
        model.updateUser(token);
    });

    describe('Constructor', () => {
        it('should set the loading state', () => {
            expect(store.getState().loading.blockUI).toBeTruthy();
        });
    });

    describe('Socket Events', () => {

        describe('Initial Data', () => {
            it('should add all heroes to the store', () => {
                let heroArray = [
                    generateHero('hero1', 'someUser'),
                    generateHero('hero2', 'someUser')
                    ];
                socket.socketClient.emit(clientEvents.initialData, heroArray);

                expect(store.getState().heroes).toEqual(heroArray);
            });

            it('should add heroes from the current user to the preferred heroes array', () => {
                let heroName = 'hero2';
                socket.socketClient.emit(clientEvents.initialData, [generateHero(heroName)]);

                expect(store.getState().preferredHeroes.heroes).toEqual([heroName]);
            });

            it('should clear the loading state', () => {
                expect(store.getState().loading.blockUI).toBeTruthy();

                let heroArray = [
                    generateHero('hero1', 'someUser'),
                    generateHero('hero2', 'someUser')
                ];
                socket.socketClient.emit(clientEvents.initialData, heroArray);

                expect(store.getState().loading.blockUI).toBeFalsy();
            });
        });

        describe('Hero Added', () => {
            it('should add the new hero to the store', function() {
                let hero = generateHero();
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                expect(store.getState().heroes).toEqual([hero]);
            });

            it('should ignore duplicate heros', function() {
                let hero = generateHero();
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                expect(store.getState().heroes).toEqual([hero]);
            });

            it('should add heroes from the current user to the preferred heroes array', function() {
                let hero = generateHero();
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                expect(store.getState().preferredHeroes.heroes).toEqual([hero.heroName]);
            });

            it('should handle the error event for hero added', function() {
                const hero = 'tracer';
                model.addPreferredHero(hero, 1);
                expect(store.getState().preferredHeroes.heroes).toEqual([hero]);

                socket.socketClient.emit(clientEvents.error.addHero, {heroName: hero});
                expect(store.getState().preferredHeroes.heroes).toEqual([]);
            });

            xit('should create a new group for the current user if the hero added is the first preferred hero', () => {
                let heroObject = 'hero';
                model.addPreferredHero(heroObject, 1);
                socket.socketClient.emit(clientEvents.createGroup, heroObject);
                expect(store.getState().group.leader).toEqual({
                    platformDisplayName: 'PwNShoPP', 
                    heroName: heroObject
                });
            });

            xit('should promote leader of the group for the current user if the hero added replaces the first preferred hero', () => {

            });
        });

        describe('heroRemoved', () => {
            it('should add the new hero to the store', function() {
                let hero = generateHero();
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                expect(store.getState().heroes).toEqual([hero]);
                socket.socketClient.emit(clientEvents.heroRemoved, hero);
                expect(store.getState().heroes).toEqual([]);
            });

            it('should remove heroes from the preferred hero array too', function() {
                let hero = generateHero();
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                expect(store.getState().preferredHeroes.heroes).toEqual([hero.heroName]);
                socket.socketClient.emit(clientEvents.heroRemoved, hero);
                expect(store.getState().preferredHeroes.heroes).toEqual([]);
            });
        });

        describe('Group', () => {
            const initialGroup = {
                groupId: null,
                members: [],
                pending: []
            };
            groupInvites[0].inviteDate = "2018-02-14T11:12:57.706Z";
            const group = groupInvites[0];
            const error = {
                groupId: group.groupId
            };

            describe('invite received', () => {
                it('should add the group invite to the list', () => {
                    let invite = generateInvite();
                    socket.socketClient.emit(clientEvents.groupInviteReceived, invite);
                    expect(store.getState().groupInvites).toEqual([invite]);
                });

                it('should not add multiple invites with the same id to the list', () => {
                    let invite = generateInvite();
                    socket.socketClient.emit(clientEvents.groupInviteReceived, invite);
                    socket.socketClient.emit(clientEvents.groupInviteReceived, invite);
                    expect(store.getState().groupInvites).toEqual([invite]);
                });
            });

            describe('Group Promoted Leader', () => {
                it('should update store.group to new group when clientEvents.groupPromotedLeader is emitted', () => {
                    expect(store.getState().group).toEqual(initialGroup);
                    socket.socketClient.emit(clientEvents.groupPromotedLeader, group);
                    expect(store.getState().group).toEqual(group);
                });
            });

            describe('Player Invited', () => {
                it('should update store.group to new group when clientEvents.playerInvited is emitted', () => {
                    expect(store.getState().group).toEqual(initialGroup);
                    socket.socketClient.emit(clientEvents.playerInvited, group);
                    expect(store.getState().group).toEqual(group);
                });
            });

            describe('Group Hero Left', () => {
                it('should update store.group to new group when clientEvents.groupHeroLeft is emitted', () => {
                    expect(store.getState().group).toEqual(initialGroup);
                    socket.socketClient.emit(clientEvents.groupHeroLeft, group);
                    expect(store.getState().group).toEqual(group);
                });
            });

            describe('Group invite accepted', () => {
                it('should update store.group to new group when clientEvents.groupInviteAccepted is emitted', () => {
                    expect(store.getState().group).toEqual(initialGroup);
                    socket.socketClient.emit(clientEvents.groupInviteAccepted, group);
                    expect(store.getState().group).toEqual(group);
                });

                it('should handle the error event', () => {
                    window.console.error = jest.fn();
                    socket.socketClient.emit(clientEvents.error.groupInviteAccept, error);
                    expect(window.console.error).toHaveBeenCalledWith(error.groupId);
                });
            });

            describe('Group Invite Canceled', () => {
                it('should update store.group to new group when clientEvents.groupInviteCanceled is emitted', () => {
                     expect(store.getState().group).toEqual(initialGroup);
                     socket.socketClient.emit(clientEvents.groupInviteCanceled, group);
                     expect(store.getState().group).toEqual(group);
                });

                it('should handle the error event', () => {
                    window.console.error = jest.fn();
                    socket.socketClient.emit(clientEvents.error.groupInviteCancel, error);
                    expect(window.console.error).toHaveBeenCalledWith(error.groupId);
                });
            });

            describe('Group invite declined', () => {
                it('should update store.group to new group when clientEvents.groupInviteDeclined is emitted', () => {
                    expect(store.getState().group).toEqual(initialGroup);
                    socket.socketClient.emit(clientEvents.groupInviteDeclined, group);
                    expect(store.getState().group).toEqual(group);
                });
            });
        });
    });

    describe('Methods', () => {
        describe('addPreferredHero', function() {
            it('should add the new hero to the preferredHero and heroes array', function() {
                let hero = generateHero();
                model.addPreferredHero(hero.heroName, 1);
                expect(store.getState().preferredHeroes.heroes).toEqual([hero.heroName]);
            });

            it('should insert the hero into the correct position in the heroes array', function() {
                let hero = generateHero('winston');
                model.addPreferredHero(generateHero('genji').heroName, 1);
                model.addPreferredHero(generateHero('tracer').heroName, 2);
                model.addPreferredHero(generateHero('widowmaker').heroName, 3);

                model.addPreferredHero(hero.heroName, 2);

                expect(store.getState().preferredHeroes.heroes).toEqual(['genji', 'winston', 'widowmaker']);
            });

            it('should ignore duplicate heros', function() {
                let hero = generateHero();
                model.addPreferredHero(hero.heroName, 1);
                model.addPreferredHero(hero.heroName, 2);
                expect(store.getState().preferredHeroes.heroes).toEqual([hero.heroName]);
            });
        });

        describe('updatePreferredHeroes', function() {

            it('should update the preferred heroes array to the argument', function() {
                let hero = generateHero();
                let hero2 = generateHero('hero2');
                model.updatePreferredHeroes([hero.heroName, hero2.heroName]);
                expect(store.getState().preferredHeroes.heroes).toEqual([hero.heroName, hero2.heroName]);
            });

            it('Should send the removeHero socket event for missing heroes', function(done) {
                let hero = generateHero('winston');
                socket.removeHero = function(heroName) {
                    expect(heroName).toBe('genji');
                    done();
                };

                model.addPreferredHero(generateHero('genji').heroName, 1);
                model.addPreferredHero(generateHero('tracer').heroName, 2);
                model.addPreferredHero(generateHero('widowmaker').heroName, 3);

                model.updatePreferredHeroes([hero.heroName, 'tracer', 'widowmaker']);
            });

            it('should send the addHero socket event for new heroes', function(done) {
                let hero = generateHero('winston');

                model.addPreferredHero(generateHero('genji').heroName, 1);
                model.addPreferredHero(generateHero('tracer').heroName, 2);
                model.addPreferredHero(generateHero('widowmaker').heroName, 3);

                socket.addHero = function(heroName, preference) {
                    expect(heroName).toBe('winston');
                    expect(preference).toBe(1);
                    done();
                };

                model.updatePreferredHeroes([hero.heroName, 'tracer', 'widowmaker']);
            });

            it('should remove extra heroes when the new array is shorter', (done) => {

                model.addPreferredHero(generateHero('genji').heroName, 1);
                model.addPreferredHero(generateHero('tracer').heroName, 2);
                model.addPreferredHero(generateHero('widowmaker').heroName, 3);

                socket.removeHero = function(heroName) {
                    expect(heroName).toBe('widowmaker');
                    done();
                };

                model.updatePreferredHeroes(['genji', 'tracer']);
            });
        });

        describe('addHeroFilter', function() {
            it('should add the new filter to the filters array', function() {
                let filter = names[0];
                model.addHeroFilterToStore(filter);
                expect(store.getState().heroFilters).toEqual([filter]);
            });
        });

        describe('removeHeroFilter', function() {
            it('should remove the filter from the filters array', function() {
                let filter = names[0];
                model.addHeroFilterToStore(filter);
                model.addHeroFilterToStore(names[1]);
                model.removeHeroFilterFromStore(filter);
                expect(store.getState().heroFilters).toEqual([names[1]]);
            });
        });

        describe('updateUser', () => {
            it('should set the user object in the state', () => {
                let user = generateUser('someRandomID');
                model.updateUser(user);
                expect(store.getState().user).toEqual(user);
            });

            it('should replace the user if one is already set', () => {
                let user = generateUser('someRandomID');
                let user2 = generateUser('anotherRandomId');

                expect(user2).not.toEqual(user);

                model.updateUser(user);
                model.updateUser(user2);

                expect(store.getState().user).toEqual(user2);
            });
        });

        describe('createNewGroup', () => {
            it('should call websocket.createGroup with heroName', () => {
                model.createNewGroup(groupInvites[0].heroName);
                expect(socket.createGroup).toHaveBeenCalledWith(groupInvites[0].heroName);
            });
        });

        describe('inviteUserToGroup', () => {
            it('should call websocket.groupInviteSend with groupId', () => {
                let userObject = groupInvites[0].member;
                model.inviteUserToGroup(userObject);
                expect(socket.groupInviteSend).toHaveBeenCalledWith(userObject);
            });
        });

        describe('leaveGroup', () => {
            it('should call websocket.leaveGroup with groupId', () => {
                model.leaveGroup(groupInvites[0].groupId);
                expect(socket.groupLeave).toHaveBeenCalledWith(groupInvites[0].groupId);
            });
        });

        describe('acceptInvite', () => {
            it('should call websocket.groupInviteAccept with groupId', () => {
                model.acceptInvite(groupInvites[0].groupId);
                expect(socket.groupInviteAccept).toHaveBeenCalledWith(groupInvites[0].groupId);
            });
        });

        describe('cancelInvite', () => {
            it('should call websocket.cancelInvite with groupId', () => {
                model.cancelInvite(groupInvites[0].groupId);
                expect(socket.groupInviteCancel).toHaveBeenCalledWith(groupInvites[0].groupId);
            });
        });

        describe('declineInvite', () => {
            it('should call websocket.groupInviteDecline with groupId', () => {
                model.declineInvite(groupInvites[0].groupId);
                expect(socket.groupInviteDecline).toHaveBeenCalledWith(groupInvites[0].groupId);
            });
        });
    });
});