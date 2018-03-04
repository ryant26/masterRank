import model from './model';
import {createStore} from './store';
import {clientEvents} from '../api/websocket';

const names = require('../../../shared/libs/allHeroNames').names;

import {
    getMockSocket,
    generateMockUser,
    generateMockHero,
    mockLocalStorage
} from '../utilities/test/mockingUtilities';

import { initialGroup, groupInvites } from '../resources/groupInvites';
import NotRealHeroes from '../resources/metaListFillerHeroes';

import * as Notifications from '../components/Notifications/Notifications';
jest.mock('../components/Notifications/Notifications');
import { preferMostPlayedHeroes } from '../actionCreators/preferredHeroes/preferMostPlayedHeroes';
jest.mock('../actionCreators/preferredHeroes/preferMostPlayedHeroes');

const clearStoreState = (store) => {
     store.getState().heroes = [];
     store.getState().preferredHeroes.heroes = [];
     store.getState().group = initialGroup;
     store.getState().loading.blockUI = 0;
     store.getState().groupInvites = [];
     store.getState().heroFilters = [];
};

describe('Model', () => {
    let store;
    let socket;

    beforeEach(() => {
        store = createStore();
        socket = getMockSocket();
        model.initialize(socket, store);
    });

    afterEach(() => {
        clearStoreState(store);
    });

    describe('Constructor', () => {
        it('should set the loading state', () => {
            expect(store.getState().loading.blockUI).toBeTruthy();
        });
    });

    describe('Socket Events', () => {
        const user = generateMockUser();
        const hero = generateMockHero('mercy', user.platformDisplayName);

        beforeEach(() => {
            store.getState().user = user;
        });

        describe('when socket disconnects', () => {
            const reason = "lost connection to socket server";

            it('should send disconnect notification to user', () => {
                socket.socketClient.emit(clientEvents.disconnect, reason);
                expect(Notifications.disconnectedNotification).toHaveBeenCalled();
            });

            it('should block user actions', () => {
                store.getState().loading.blockUI = 0;
                socket.socketClient.emit(clientEvents.disconnect, reason);
                expect(store.getState().loading.blockUI).toBe(1);
            });
        });

        describe('InitialData', () => {

            const userHeroesFromServer = [
                 generateMockHero('tracer', user.platformDisplayName, 1),
                 generateMockHero('mercy', user.platformDisplayName, 2)
            ];
            const nonUserHeroesFromServer = [
                generateMockHero('winston', 'cutie#1320', 1),
                generateMockHero('winston', 'nd44#5378', 1),
                generateMockHero('genji', 'nd44#5378', 2),
                generateMockHero('phara', 'nd44#5378', 3),
                generateMockHero('winston', 'PwNShoPP#8954', 1),
            ];
            const heroesFromServer = [...userHeroesFromServer, ...nonUserHeroesFromServer];

            describe('when user has preferred heroes', () => {
                const preferredHeroes = [
                    'tracer',
                    'phara'
                ];

                beforeEach(() => {
                    store.getState().preferredHeroes.heroes = preferredHeroes;
                });

                it('should clear all existing heroes from the meta list, store.heroes', () => {
                    store.getState().heroes = heroesFromServer;
                    socket.socketClient.emit(clientEvents.initialData, []);
                    expect(store.getState().heroes).toEqual(NotRealHeroes);
                });

                it("heroes on the server that do not belong to the user should be added to store heroes", () => {
                    socket.socketClient.emit(clientEvents.initialData, heroesFromServer);
                    expect(store.getState().heroes).toEqual([...NotRealHeroes, ...nonUserHeroesFromServer]);
                });

                it("heroes on the server that belong to the user should be removed from the server", () => {
                    userHeroesFromServer.forEach((heroFromServer) => {
                        expect(heroFromServer.platformDisplayName).toBe(user.platformDisplayName);
                    });
                    socket.socketClient.emit(clientEvents.initialData, heroesFromServer);
                    userHeroesFromServer.forEach((heroFromServer) => {
                        expect(socket.removeHero).toHaveBeenCalledWith(heroFromServer.heroName);
                    });
                });

                it("heroes on the server that do not belong to the user should not be removed from the server", () => {
                    socket.socketClient.emit(clientEvents.initialData, heroesFromServer);
                    nonUserHeroesFromServer.forEach((heroFromServer) => {
                        expect(socket.removeHero).not.toHaveBeenCalledWith(heroFromServer.heroName);
                    });
                });

                it("user's preferred heroes should be added to the server", () => {
                    socket.socketClient.emit(clientEvents.initialData, heroesFromServer);
                    preferredHeroes.forEach((preferredHero, i) => {
                        expect(socket.addHero).toHaveBeenCalledWith(preferredHero, (i+1));
                    });
                });

                it('should clear the loading state', () => {
                    store.getState().loading.blockUI = 1;
                    socket.socketClient.emit(clientEvents.initialData, heroesFromServer);
                    expect(store.getState().loading.blockUI).toBe(0);
                });

                it("heroes that do not belong to the user should not be added to preferred heroes", () => {
                    socket.socketClient.emit(clientEvents.initialData, heroesFromServer);
                    expect(store.getState().preferredHeroes.heroes).toEqual(preferredHeroes);
                });
            });

            describe('when no heroes are preferred', () => {

                beforeEach(() => {
                    mockLocalStorage();
                    store.dispatch = jest.fn();
                    store.getState().preferredHeroes.heroes = [];
                });

                it("should prefer user's most played heroes", () => {
                    socket.socketClient.emit(clientEvents.initialData, heroesFromServer);
                    expect(preferMostPlayedHeroes).toHaveBeenCalledWith(
                        user,
                        localStorage.getItem('accessToken'),
                        socket
                    );
                });
            });
        });

        describe('Hero Added', () => {

            beforeEach(() => {
                Notifications.preferredHeroNotification.mockClear();
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

            it('when error occurs should remove error.hero from the store', function() {
                const hero = 'tracer';
                store.getState().preferredHeroes.heroes = [hero];

                expect(store.getState().preferredHeroes.heroes[0]).toEqual(hero);
                socket.socketClient.emit(clientEvents.error.addHero, {heroName: hero});
                expect(store.getState().preferredHeroes.heroes).toEqual([]);
                expect(Notifications.errorNotification).toHaveBeenCalledWith(hero);
            });

            it('should send a preferred hero notifications when hero added belongs to the user', function() {
                expect(store.getState().user.platformDisplayName).toBe(hero.platformDisplayName);
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                expect(Notifications.preferredHeroNotification).toHaveBeenCalledWith(hero.heroName);
            });

            it('should pop loading screen when hero belongs to the user', function() {
                expect(store.getState().user.platformDisplayName).toBe(hero.platformDisplayName);
                store.getState().loading.blockUI = 1;
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                expect(store.getState().loading.blockUI).toBe(0);
            });

            it('should not send a preferred hero notifications when hero does not belong to the user', function() {
                store.getState().user.platformDisplayName = "Not" + hero.platformDisplayName;
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                expect(Notifications.preferredHeroNotification).not.toHaveBeenCalled();
            });

            it('should not pop loading screen when hero added does not belong to the user', function() {
                store.getState().user.platformDisplayName = "Not" + hero.platformDisplayName;
                store.getState().loading.blockUI = 1;
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                expect(store.getState().loading.blockUI).toBe(1);
            });

            //TODO: is this something we want to add? can we delete this?
            xit('should create a new group for the current user if the hero added is the first preferred hero', () => {

            });

            //TODO: is this something we want to add? can we delete this?
            xit('should promote leader of the group for the current user if the hero added replaces the first preferred hero', () => {

            });
        });

        describe('heroRemoved', () => {

            beforeEach(() => {
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
            const group = groupInvites[0];

            const shouldCallErrorNotification = (errorEvent) => {
                const error = {
                    message: "Something went wrong!"
                };
                it(`should call errorNotification() with error when ${errorEvent} is emitted`, () => {
                    socket.socketClient.emit(errorEvent, error);
                    expect(Notifications.errorNotification).toHaveBeenCalledWith(error.message);
                });
            };

            describe('Group Promoted Leader', () => {

                beforeEach(() => {
                    Notifications.leaderLeftGroupNotification.mockClear();
                });

                it('should update store.group to new group when clientEvents.groupPromotedLeader is emitted', () => {
                    expect(store.getState().group).toEqual(initialGroup);
                    socket.socketClient.emit(clientEvents.groupPromotedLeader, group);
                    expect(store.getState().group).toEqual(group);
                });

                it('should sent leaderLeftGroupNotification when user is not group leader', () => {
                    expect(store.getState().user.platformDisplayName).not.toBe(group.leader.platformDisplayName);
                    socket.socketClient.emit(clientEvents.groupPromotedLeader, group);
                    expect(Notifications.leaderLeftGroupNotification).toHaveBeenCalledWith(group.leader.platformDisplayName);
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

                it('should send group members userJoinedGroupNotification with new members display name', () => {
                    store.getState().group = group;
                    let newGroup = JSON.parse(JSON.stringify( group ));
                    let newMember = newGroup.pending[0];
                    newGroup.members.push(newMember);
                    newGroup.pending.pop();

                    expect(store.getState().group).not.toBe(newGroup);
                    socket.socketClient.emit(clientEvents.groupInviteAccepted, newGroup);
                    expect(Notifications.userJoinedGroupNotification).toHaveBeenCalledWith(newMember.platformDisplayName);
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
                    expect(Notifications.inviteReceivedNotification).toHaveBeenCalledWith(group.leader.platformDisplayName);
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
        describe('updatePreferredHeroes', function() {

            it('should update the preferred heroes array to the argument', function() {
                let hero = generateMockHero();
                let hero2 = generateMockHero('hero2');
                expect(store.getState().preferredHeroes.heroes).not.toEqual([hero.heroName, hero2.heroName]);
                model.updatePreferredHeroes([hero.heroName, hero2.heroName]);
                expect(store.getState().preferredHeroes.heroes).toEqual([hero.heroName, hero2.heroName]);
            });

            it('Should send the removeHero socket event for missing heroes', function(done) {
                store.getState().preferredHeroes.heroes = ['genji', 'tracer', 'widowmaker'];
                let hero = generateMockHero('winston');
                socket.removeHero = function(heroName) {
                    expect(heroName).toBe('genji');
                    done();
                };


                model.updatePreferredHeroes([hero.heroName, 'tracer', 'widowmaker']);
            });

            it('should send the addHero socket event for new heroes', function(done) {
                store.getState().preferredHeroes.heroes = ['genji', 'tracer', 'widowmaker'];
                let hero = generateMockHero('winston');

                socket.addHero = function(heroName, preference) {
                    expect(heroName).toBe('winston');
                    expect(preference).toBe(1);
                    done();
                };

                model.updatePreferredHeroes([hero.heroName, 'tracer', 'widowmaker']);
            });

            it('should remove extra heroes when the new array is shorter', (done) => {
                store.getState().preferredHeroes.heroes = ['genji', 'tracer', 'widowmaker'];

                socket.removeHero = function(heroName) {
                    expect(heroName).toBe('widowmaker');
                    done();
                };

                model.updatePreferredHeroes(['genji', 'tracer']);
            });

            it('should push one loading screen for each new hero added', () => {
                let newPreferredHeroes = ['genji', 'tracer'];
                store.getState().loading.blockUI = 0;

                store.getState().preferredHeroes.heroes = [];
                model.updatePreferredHeroes(newPreferredHeroes);
                expect(store.getState().loading.blockUI).toBe(newPreferredHeroes.length);
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
                let user = generateMockUser('someRandomID');
                model.updateUser(user);
                expect(store.getState().user).toEqual(user);
            });

            it('should replace the user if one is already set', () => {
                let user = generateMockUser('someRandomID');
                let user2 = generateMockUser('anotherRandomId');

                expect(user2).not.toEqual(user);

                model.updateUser(user);
                model.updateUser(user2);

                expect(store.getState().user).toEqual(user2);
            });
        });

        describe('createNewGroup', () => {
            it('should call websocket.createGroup with heroName', () => {
                store.getState().preferredHeroes.heroes = [groupInvites[0].heroName];
                model.createNewGroup();
                expect(socket.createGroup).toHaveBeenCalledWith(groupInvites[0].heroName);
            });
        });

        describe('inviteUserToGroup', () => {
            const userObject = groupInvites[0].members[0];

            it('should call websocket.groupInviteSend with userObject', () => {
                model.inviteUserToGroup(userObject);
                expect(socket.groupInviteSend).toHaveBeenCalledWith(userObject);
            });

            it('should call inviteSentNotification with user platform display name', () => {
                model.inviteUserToGroup(userObject);
                expect(Notifications.inviteSentNotification).toHaveBeenCalledWith(userObject.platformDisplayName);
            });
        });

        describe('leaveGroup', () => {
            const group = groupInvites[0];

            beforeEach(() => {
                store.getState().group = group;
            });

            it('should call websocket.leaveGroup', () => {
                model.leaveGroup();
                expect(socket.groupLeave).toHaveBeenCalled();
            });

            it('should clear group from store', () => {
                expect(store.getState().group).not.toBe(initialGroup);
                model.leaveGroup();
                expect(store.getState().group).toEqual(initialGroup);
            });

            it('should call successfullyLeftGroupNotification with user platform display name', () => {
                model.leaveGroup();
                expect(Notifications.successfullyLeftGroupNotification).toHaveBeenCalledWith(group.leader.platformDisplayName);
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

            it("should call joinedGroupNotification with group invite leader's name", () => {
                model.acceptGroupInviteAndRemoveFromStore(invite);
                expect(Notifications.joinedGroupNotification).toHaveBeenCalledWith(invite.leader.platformDisplayName);
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