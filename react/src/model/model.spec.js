import model from './model';
import {createStore} from './store';
import {clientEvents} from '../api/websocket';

const mockSocket = require('socket-io-mock');
const names = require('../../../shared/libs/allHeroNames').names;

import { initialGroup, groupInvites } from '../resources/groupInvites';

import NotRealHeroes from '../resources/metaListFillerHeroes';

import {
    joinGroupNotification,
    inviteReceivedNotification,
    errorNotification
} from '../components/Notifications/Notifications';
jest.mock('../components/Notifications/Notifications');

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
    });

    describe('Constructor', () => {
        it('should set the loading state', () => {
            expect(store.getState().loading.blockUI).toBeTruthy();
        });
    });

    describe('Socket Events', () => {
        const userToken = {platformDisplayName: 'Luckybomb#1470', region: 'us', platform: 'pc'};
        const userDisplayName = userToken.platformDisplayName;
        const heroesFromServer = [
            generateHero('tracer', userDisplayName, 1),
            generateHero('winston', userDisplayName, 2),
            generateHero('winston', 'cutie#1320', 1),
            generateHero('winston', 'nd44#5378', 1),
            generateHero('genji', 'nd44#5378', 2),
            generateHero('phara', 'nd44#5378', 3),
            generateHero('winston', 'PwNShoPP#8954', 1),
        ];

        beforeEach(() => {
            model.updateUser(userToken);
        });

        describe('Initial Data', () => {

            const localStorePreferredHeroes = [
                'tracer',
                'phara'
            ];

            beforeEach(() => {
                localStorePreferredHeroes.forEach((heroName, i) => {
                    model.addPreferredHeroToStore(heroName, (i+1));
                });
            });

            it('should clear all heroes in meta list from store.heroes', () => {
                socket.socketClient.emit(clientEvents.heroAdded, heroesFromServer[0]);
                socket.socketClient.emit(clientEvents.heroAdded, heroesFromServer[1]);
                socket.socketClient.emit(clientEvents.initialData, []);
                //TODO: NotRealHeroes, are only temporary to help us get good feedback, The test are a little weird for now.
                //TODO: original test = expect(store.getState().heroes).toEqual([]);
                expect(store.getState().heroes).toEqual(NotRealHeroes);
            });

            it("heroes on the server that do not belong to the user should be added to store heroes", () => {
                socket.socketClient.emit(clientEvents.initialData, heroesFromServer);
                //TODO: NotRealHeroes, are only temporary to help us get good feedback, The test are a little weird for now.
                //TODO: original test = expect(store.getState().heroes).toEqual(heroesFromServer.splice(2));
                expect(store.getState().heroes).toEqual([...NotRealHeroes, ...heroesFromServer.splice(2)]);
            });

            it("heroes on the server that belong to the user should be removed from the server", () => {
                expect(heroesFromServer[0].platformDisplayName).toBe(userDisplayName);
                expect(heroesFromServer[1].platformDisplayName).toBe(userDisplayName);
                socket.socketClient.emit(clientEvents.initialData, heroesFromServer);
                expect(socket.removeHero).toHaveBeenCalledWith(heroesFromServer[0].heroName);
                expect(socket.removeHero).toHaveBeenCalledWith(heroesFromServer[1].heroName);
            });

            it("heroes on the server that belong to the user should not be added to store preferred heroes", () => {
                expect(heroesFromServer[1].platformDisplayName).toBe(userDisplayName);
                socket.socketClient.emit(clientEvents.initialData, heroesFromServer);
                expect(store.getState().preferredHeroes.heroes.includes(heroesFromServer[1].heroName)).toBeFalsy();
            });

            it("user's preferred heroes should be added to the server", () => {
                socket.socketClient.emit(clientEvents.initialData, heroesFromServer);
                expect(socket.addHero).toHaveBeenCalledWith(localStorePreferredHeroes[0], 1);
                expect(socket.addHero).toHaveBeenCalledWith(localStorePreferredHeroes[1], 2);
            });

            it('should clear the loading state', () => {
                expect(store.getState().loading.blockUI).toBeTruthy();
                socket.socketClient.emit(clientEvents.initialData, heroesFromServer);
                expect(store.getState().loading.blockUI).toBeFalsy();
            });
        });

        describe('Hero Added', () => {
            const userToken = {platformDisplayName: 'Luckybomb#1470', region: 'us', platform: 'pc'};
            const hero = generateHero('mercy', userToken.platformDisplayName);

            beforeEach(() => {
                model.updateUser(userToken);
            });

            it('should add the new hero to the store', function() {
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                expect(store.getState().heroes).toEqual([hero]);
            });

            it('should ignore duplicate heroes', function() {
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                expect(store.getState().heroes).toEqual([hero]);
            });

            it('should add heroes from the current user to the preferred heroes array', function() {
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                expect(store.getState().preferredHeroes.heroes).toEqual([hero.heroName]);
            });

            it('when error occurs should remove error.hero from the store', function() {
                const hero = 'tracer';
                model.addPreferredHeroToStore(hero, 1);

                expect(store.getState().preferredHeroes.heroes[0]).toEqual(hero);
                socket.socketClient.emit(clientEvents.error.addHero, {heroName: hero});
                expect(store.getState().preferredHeroes.heroes).toEqual([]);
                expect(errorNotification).toHaveBeenCalledWith(hero);
            });

            //TODO: is this something we want to add? can we delete this?
            xit('should create a new group for the current user if the hero added is the first preferred hero', () => {

            });

            //TODO: is this something we want to add? can we delete this?
            xit('should promote leader of the group for the current user if the hero added replaces the first preferred hero', () => {

            });
        });

        describe('heroRemoved', () => {
            const userToken = {platformDisplayName: 'Luckybomb#1470', region: 'us', platform: 'pc'};
            const hero = generateHero('mercy', userToken.platformDisplayName);

            beforeEach(() => {
                model.updateUser(userToken);
                socket.socketClient.emit(clientEvents.heroAdded, hero);
            });

            it('should remove hero from store.heroes', function() {
                expect(store.getState().heroes).toEqual([hero]);
                socket.socketClient.emit(clientEvents.heroRemoved, hero);
                expect(store.getState().heroes).toEqual([]);
            });
            
            xit('should remove hero from store.preferredHeroes.heroes', function() {
                expect(store.getState().preferredHeroes.heroes).toEqual([hero.heroName]);
                socket.socketClient.emit(clientEvents.heroRemoved, hero);
                expect(store.getState().preferredHeroes.heroes).toEqual([]);
            });
        });

        describe('Group', () => {
            groupInvites[0].inviteDate = "2018-02-14T11:12:57.706Z";
            const group = groupInvites[0];

            const shouldCallErrorNotification = (errorEvent) => {
                const error = {
                    message: "Something went wrong!"
                };
                it(`should call errorNotification() with error when ${errorEvent} is emitted`, () => {
                    socket.socketClient.emit(errorEvent, error);
                    expect(errorNotification).toHaveBeenCalledWith(error.message);
                });
            };

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
                it('should update store.group to new group when clientEvents.playerHeroLeft is emitted', () => {
                    expect(store.getState().group).toEqual(initialGroup);
                    socket.socketClient.emit(clientEvents.playerHeroLeft, group);
                    expect(store.getState().group).toEqual(group);
                });
            });

            describe('Group invite accepted', () => {
                it('should update store.group to new group when clientEvents.groupInviteAccepted is emitted', () => {
                    expect(store.getState().group).toEqual(initialGroup);
                    socket.socketClient.emit(clientEvents.groupInviteAccepted, group);
                    expect(store.getState().group).toEqual(group);
                });
            });

            describe('Group Invite Canceled', () => {
                it('should remove groupInvite from store.groupInvites', () => {
                     socket.socketClient.emit(clientEvents.groupInviteReceived, group);
                     expect(store.getState().groupInvites).toEqual([group]);
                     socket.socketClient.emit(clientEvents.groupInviteCanceled, group);
                     expect(store.getState().groupInvites).toEqual([]);
                });
            });

            describe('Player Invite Canceled', () => {
                it("should update all group member's store.group to new group", () => {
                     expect(store.getState().group).toEqual(initialGroup);
                     socket.socketClient.emit(clientEvents.playerInviteCanceled, group);
                     expect(store.getState().group).toEqual(group);
                });
            });

            describe('Player Invite Canceled', () => {
                it("should update all group member's store.group to new group", () => {
                     expect(store.getState().group).toEqual(initialGroup);
                     socket.socketClient.emit(clientEvents.playerInviteCanceled, group);
                     expect(store.getState().group).toEqual(group);
                });
            });

            describe('Group Invite Received', () => {
                it('should add group invite to store.groupInvites', () => {
                    expect(store.getState().groupInvites).toEqual([]);
                    socket.socketClient.emit(clientEvents.groupInviteReceived, group);
                    expect(store.getState().groupInvites).toEqual([group]);
                });

                it('should not add duplicate group invites to store.groupInvites', () => {
                    expect(store.getState().groupInvites).toEqual([]);
                    socket.socketClient.emit(clientEvents.groupInviteReceived, group);
                    socket.socketClient.emit(clientEvents.groupInviteReceived, group);
                    expect(store.getState().groupInvites).toEqual([group]);
                });

                it('should add multiple group invites to store.groupInvites', () => {
                    expect(store.getState().groupInvites).toEqual([]);
                    groupInvites.forEach((groupInvite) => {
                        socket.socketClient.emit(clientEvents.groupInviteReceived, groupInvite);
                    });
                    expect(store.getState().groupInvites).toEqual(groupInvites);
                });

                it('should sent group invite received notification to user with group leaders display name', () => {
                    socket.socketClient.emit(clientEvents.groupInviteReceived, group);
                    expect(inviteReceivedNotification).toHaveBeenCalledWith(group.leader.platformDisplayName);
                });
            });

            describe('Group invite declined', () => {
                it('should update store.group to new group when clientEvents.groupInviteDeclined is emitted', () => {
                    expect(store.getState().group).toEqual(initialGroup);
                    socket.socketClient.emit(clientEvents.groupInviteDeclined, group);
                    expect(store.getState().group).toEqual(group);
                });
            });

            describe('Error', () => {
                shouldCallErrorNotification(clientEvents.error.groupLeave);
                shouldCallErrorNotification(clientEvents.error.groupInviteAccept);
                shouldCallErrorNotification(clientEvents.error.groupInviteDecline);
                shouldCallErrorNotification(clientEvents.error.groupInviteCancel);
            });
        });
    });

    describe('Methods', () => {
        describe('addPreferredHeroToStore', function() {
            it('should add the new hero to the preferredHero and heroes array', function() {
                let hero = generateHero();
                model.addPreferredHeroToStore(hero.heroName, 1);
                expect(store.getState().preferredHeroes.heroes).toEqual([hero.heroName]);
            });

            it('should insert the hero into the correct position in the heroes array', function() {
                let hero = generateHero('winston');
                model.addPreferredHeroToStore(generateHero('genji').heroName, 1);
                model.addPreferredHeroToStore(generateHero('tracer').heroName, 2);
                model.addPreferredHeroToStore(generateHero('widowmaker').heroName, 3);

                model.addPreferredHeroToStore(hero.heroName, 2);

                expect(store.getState().preferredHeroes.heroes).toEqual(['genji', 'winston', 'widowmaker']);
            });

            it('should ignore duplicate heroes', function() {
                let hero = generateHero();
                model.addPreferredHeroToStore(hero.heroName, 1);
                model.addPreferredHeroToStore(hero.heroName, 2);
                expect(store.getState().preferredHeroes.heroes).toEqual([hero.heroName]);
            });
        });

        describe('updatePreferredHeroes', function() {

            it('should update the preferred heroes array to the argument', function() {
                let hero = generateHero();
                let hero2 = generateHero('hero2');
                expect(store.getState().preferredHeroes.heroes).not.toEqual([hero.heroName, hero2.heroName]);
                model.updatePreferredHeroes([hero.heroName, hero2.heroName]);
                expect(store.getState().preferredHeroes.heroes).toEqual([hero.heroName, hero2.heroName]);
            });

            it('Should send the removeHero socket event for missing heroes', function(done) {
                let hero = generateHero('winston');
                socket.removeHero = function(heroName) {
                    expect(heroName).toBe('genji');
                    done();
                };

                model.addPreferredHeroToStore(generateHero('genji').heroName, 1);
                model.addPreferredHeroToStore(generateHero('tracer').heroName, 2);
                model.addPreferredHeroToStore(generateHero('widowmaker').heroName, 3);

                model.updatePreferredHeroes([hero.heroName, 'tracer', 'widowmaker']);
            });

            it('should send the addHero socket event for new heroes', function(done) {
                let hero = generateHero('winston');

                model.addPreferredHeroToStore(generateHero('genji').heroName, 1);
                model.addPreferredHeroToStore(generateHero('tracer').heroName, 2);
                model.addPreferredHeroToStore(generateHero('widowmaker').heroName, 3);

                socket.addHero = function(heroName, preference) {
                    expect(heroName).toBe('winston');
                    expect(preference).toBe(1);
                    done();
                };

                model.updatePreferredHeroes([hero.heroName, 'tracer', 'widowmaker']);
            });

            it('should remove extra heroes when the new array is shorter', (done) => {

                model.addPreferredHeroToStore(generateHero('genji').heroName, 1);
                model.addPreferredHeroToStore(generateHero('tracer').heroName, 2);
                model.addPreferredHeroToStore(generateHero('widowmaker').heroName, 3);

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
            it('should call websocket.leaveGroup', () => {
                model.leaveGroup();
                expect(socket.groupLeave).toHaveBeenCalled();
            });

            it('should clear group from store', () => {
                model.createNewGroup(groupInvites[0].heroName);
                expect(store.getState().group).not.toBe(initialGroup);
                model.leaveGroup();
                expect(store.getState().group).toEqual(initialGroup);
            });
        });

        describe('cancelInvite', () => {
            it('should call websocket.cancelInvite with groupId', () => {
                model.cancelInvite(groupInvites[0].groupId);
                expect(socket.groupInviteCancel).toHaveBeenCalledWith(groupInvites[0].groupId);
            });
        });

        describe('acceptGroupInviteAndRemoveFromStore', () => {
            const invite = groupInvites[0];

            it('should remove groupInvite from store groupInvites when passed groupInvite object', () => {
                socket.socketClient.emit(clientEvents.groupInviteReceived, invite);
                expect(store.getState().groupInvites).toEqual([invite]);
                model.acceptGroupInviteAndRemoveFromStore(invite);
                expect(store.getState().groupInvites).toEqual([]);
            });

            it('should call websocket.groupInviteAccept with groupId when passed groupInvite object', () => {
                model.acceptGroupInviteAndRemoveFromStore(invite);
                expect(socket.groupInviteAccept).toHaveBeenCalledWith(groupInvites[0].groupId);
            });

            it("should call joinGroupNotification with group invite leader's name", () => {
                model.acceptGroupInviteAndRemoveFromStore(invite);
                expect(joinGroupNotification).toHaveBeenCalledWith(invite.leader.platformDisplayName);
            });
        });

        describe('declineGroupInviteAndRemoveFromStore', () => {
            const invite = groupInvites[0];

            it('should remove groupInvite from store groupInvites when passed groupInvite object', () => {
                socket.socketClient.emit(clientEvents.groupInviteReceived, invite);
                expect(store.getState().groupInvites).toEqual([invite]);
                model.declineGroupInviteAndRemoveFromStore(invite);
                expect(store.getState().groupInvites).toEqual([]);
            });

            it('should call websocket.groupInviteDecline with groupId when passed groupInvite object', () => {
                model.declineGroupInviteAndRemoveFromStore(groupInvites[0]);
                expect(socket.groupInviteDecline).toHaveBeenCalledWith(groupInvites[0].groupId);
            });
        });
    });
});