import configureStore from 'redux-mock-store';

import model from './model';
import { clientEvents } from '../api/websocket';

const names = require('../../../shared/libs/allHeroNames').names;

import {
    getMockSocket,
    generateMockUser,
    generateMockHero
} from '../utilities/test/mockingUtilities';

import { initialGroup, groupInvites } from '../resources/groupInvites';

import * as Notifications from '../components/Notifications/Notifications';
jest.mock('../components/Notifications/Notifications');
import { syncClientAndServerHeroes } from '../actionCreators/initialData/syncClientAndServerHeroes';
jest.mock('../actionCreators/initialData/syncClientAndServerHeroes');
import { leaveGroup as leaveGroupAction } from '../actionCreators/group/leaveGroup';
jest.mock('../actionCreators/group/leaveGroup');
import { updatePreferredHeroes as updatePreferredHeroesAction} from '../actionCreators/preferredHeroes/updatePreferredHeroes';
jest.mock('../actionCreators/preferredHeroes/updatePreferredHeroes');

import {
    addHero as addHeroAction,
    removeHero as removeHeroAction,
} from "../actionCreators/heroes/hero";
jest.mock("../actionCreators/heroes/hero");
import {
    removeHero as removePreferredHeroAction
} from "../actionCreators/preferredHeroes/preferredHeroes";
jest.mock("../actionCreators/preferredHeroes/preferredHeroes");
import { updateUser as updateUserAction } from "../actionCreators/user";
jest.mock("../actionCreators/user");
import {
    addFilter as addFilterAction,
    removeFilter as removeFilterAction,
} from "../actionCreators/heroFilters";
jest.mock("../actionCreators/heroFilters");
import {
    updateGroup as updateGroupAction
} from '../actionCreators/group/group';
jest.mock('../actionCreators/group/group');
import {
    addGroupInvite as addGroupInviteAction,
    removeGroupInvite as removeGroupInviteAction
} from '../actionCreators/groupInvites';
jest.mock('../actionCreators/groupInvites');
import {
    pushBlockingEvent as pushBlockingLoadingAction,
    popBlockingEvent as popBlockingLoadingAction,
} from "../actionCreators/loading";
jest.mock('../actionCreators/loading');

const mockStore = configureStore();
const getMockStore = (
    heroes=[],
    heroFilters=[],
    group=initialGroup,
    groupInvites=[],
    preferredHeroes=[],
    blockUI=0,) => {
        return mockStore({
            heroes,
            heroFilters,
            group,
            groupInvites,
            preferredHeroes: {
                heroes: preferredHeroes
            },
            loading: {
                blockUI
            }
        });
};
const clearStoreState = (store) => {
     store.getState().heroes = [];
     store.getState().preferredHeroes.heroes = [];
     store.getState().group = initialGroup;
     store.getState().loading.blockUI = 0;
     store.getState().groupInvites = [];
     store.getState().heroFilters = [];
};
const clearAllMocks = () => {
    addHeroAction.mockClear();
    removeHeroAction.mockClear();
    removePreferredHeroAction.mockClear();
    updatePreferredHeroesAction.mockClear();
    updateUserAction.mockClear();
    addFilterAction.mockClear();
    removeFilterAction.mockClear();
    updateGroupAction.mockClear();
    leaveGroupAction.mockClear();
    addGroupInviteAction.mockClear();
    removeGroupInviteAction.mockClear();
    pushBlockingLoadingAction.mockClear();
    popBlockingLoadingAction.mockClear();
};
describe('Model', () => {
    const user = generateMockUser();
    let store;
    let socket;

    beforeEach(() => {
        store = getMockStore();
        store.dispatch = jest.fn();
        socket = getMockSocket();
        model.initialize(socket, store);
        store.getState().user = user;
    });

    afterEach(() => {
        clearStoreState(store);
        clearAllMocks();
    });

    describe('Constructor', () => {
        it('should set the loading state', () => {
            expect(pushBlockingLoadingAction).toHaveBeenCalled();
        });
    });

    describe('Socket Events', () => {
        const hero = generateMockHero('mercy', user.platformDisplayName);

        describe('when socket disconnects', () => {
            const reason = "lost connection to socket server";

            it('should send disconnect notification to user', () => {
                socket.socketClient.emit(clientEvents.disconnect, reason);
                expect(Notifications.disconnectedNotification).toHaveBeenCalled();
            });

            it('should block user actions', () => {
                socket.socketClient.emit(clientEvents.disconnect, reason);
                expect(pushBlockingLoadingAction).toHaveBeenCalled();
            });
        });

        it('InitialData should call reconcileClientWith heroes from server and socket', () => {
            const heroesFromServer = [
                generateMockHero('tracer'),
                generateMockHero('winston')
            ];
            socket.socketClient.emit(clientEvents.initialData, heroesFromServer);
            expect(syncClientAndServerHeroes).toHaveBeenCalledWith(heroesFromServer, socket);
        });

        describe('Hero Added', () => {

            beforeEach(() => {
                Notifications.preferredHeroNotification.mockClear();
            });

            it('should dispatch add hero action', function() {
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                expect(addHeroAction).toHaveBeenCalledWith(hero);
            });

            it('should pop loading screen when hero belongs to the user', function() {
                expect(store.getState().user.platformDisplayName).toBe(hero.platformDisplayName);
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                expect(popBlockingLoadingAction).toHaveBeenCalled();
            });

            it('should not send a preferred hero notifications when hero does not belong to the user', function() {
                store.getState().user.platformDisplayName = "Not" + hero.platformDisplayName;
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                expect(Notifications.preferredHeroNotification).not.toHaveBeenCalled();
            });

            it('should not pop loading screen when hero added does not belong to the user', function() {
                store.getState().user.platformDisplayName = "Not" + hero.platformDisplayName;
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                expect(popBlockingLoadingAction).not.toHaveBeenCalled();
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

            it('should call remove hero action', function() {
                socket.socketClient.emit(clientEvents.heroRemoved, hero);
                expect(removeHeroAction).toHaveBeenCalledWith(hero);
            });

            it("when hero belongs to user should remove hero from user's preferred heroes", function() {
                store.getState().user.platformDisplayName = hero.platformDisplayName;
                socket.socketClient.emit(clientEvents.heroRemoved, hero);
                expect(removePreferredHeroAction).toHaveBeenCalledWith(hero.heroName, hero.priority);
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

                it('should call update group action when clientEvents.groupPromotedLeader is emitted', () => {
                    socket.socketClient.emit(clientEvents.groupPromotedLeader, group);
                    expect(updateGroupAction).toHaveBeenCalledWith(group);
                });

                it('should sent leaderLeftGroupNotification when user is not group leader', () => {
                    expect(store.getState().user.platformDisplayName).not.toBe(group.leader.platformDisplayName);
                    socket.socketClient.emit(clientEvents.groupPromotedLeader, group);
                    expect(Notifications.leaderLeftGroupNotification).toHaveBeenCalledWith(group.leader.platformDisplayName);
                });
            });

            describe('Player Invited', () => {
                it('should call update group action when clientEvents.playerInvited is emitted', () => {
                    socket.socketClient.emit(clientEvents.playerInvited, group);
                    expect(updateGroupAction).toHaveBeenCalledWith(group);
                });
            });

            describe('Group Hero Left', () => {
                it('should call update group action when clientEvents.playerHeroLeft is emitted', () => {
                    socket.socketClient.emit(clientEvents.playerHeroLeft, group);
                    expect(updateGroupAction).toHaveBeenCalledWith(group);
                });
            });

            describe('Group invite accepted', () => {
                it('should call update group action when clientEvents.groupInviteAccepted is emitted', () => {
                    socket.socketClient.emit(clientEvents.groupInviteAccepted, group);
                    expect(updateGroupAction).toHaveBeenCalledWith(group);
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
                     socket.socketClient.emit(clientEvents.groupInviteCanceled, group);
                     expect(removeGroupInviteAction).toHaveBeenCalledWith(group);
                });
            });

            describe('Player Invite Canceled', () => {
                it("should call update group action", () => {
                     socket.socketClient.emit(clientEvents.playerInviteCanceled, group);
                     expect(updateGroupAction).toHaveBeenCalledWith(group);
                });
            });

            describe('Group Invite Received', () => {
                it('should call add group invite action', () => {
                    socket.socketClient.emit(clientEvents.groupInviteReceived, group);
                    expect(addGroupInviteAction).toHaveBeenCalledWith(group);
                });

                it('should sent group invite received notification to user with group leaders display name', () => {
                    socket.socketClient.emit(clientEvents.groupInviteReceived, group);
                    expect(Notifications.inviteReceivedNotification).toHaveBeenCalledWith(group.leader.platformDisplayName);
                });
            });

            describe('Group invite declined', () => {
                it('should call update preferred heroes action', function() {
                    socket.socketClient.emit(clientEvents.groupInviteDeclined, group);
                    expect(updateGroupAction).toHaveBeenCalledWith(group);
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

        describe('updatePreferredHeroes', () => {
            it('should dispatch updatePreferredHeroesAction', () => {
                const newPreferredHeroNames = ['genji', 'tracer', 'widowmaker'];
                model.updatePreferredHeroes(newPreferredHeroNames);
                expect(updatePreferredHeroesAction).toHaveBeenCalledWith(newPreferredHeroNames, socket);
            });
        });

        describe('addHeroFilter', function() {
            it('should call remove filter action', function() {
                let filter = names[0];
                model.addHeroFilterToStore(filter);
                expect(addFilterAction).toHaveBeenCalledWith(filter);
            });
        });

        describe('removeHeroFilterFromStore', function() {
            it('should call remove filter action', function() {
                let filter = names[0];
                model.removeHeroFilterFromStore(filter);
                expect(removeFilterAction).toHaveBeenCalledWith(filter);
            });
        });

        describe('updateUser', () => {
            it('should dispatch update user action', () => {
                let user = generateMockUser();
                model.updateUser(user);
                expect(updateUserAction).toHaveBeenCalledWith(user);
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
            it('should dispatch leave group action with socket', () => {
                model.leaveGroup();
                expect(leaveGroupAction).toHaveBeenCalledWith(socket);
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

            it('should dispatch remove group invite action', () => {
                model.acceptGroupInviteAndRemoveFromStore(invite);
                expect(removeGroupInviteAction).toHaveBeenCalledWith(invite);
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
                model.declineGroupInviteAndRemoveFromStore(invite);
                expect(removeGroupInviteAction).toHaveBeenCalledWith(invite);
            });

            it('should call websocket.groupInviteDecline with groupId when passed groupInvite object', () => {
                model.declineGroupInviteAndRemoveFromStore(groupInvites[0]);
                expect(socket.groupInviteDecline).toHaveBeenCalledWith(groupInvites[0].groupId);
            });
        });
    });
});