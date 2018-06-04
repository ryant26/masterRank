import {
    addHero as addHeroAction,
    removeHero as removeHeroAction,
} from "actionCreators/heroes/hero";
import {
    removeHero as removePreferredHeroAction,
} from "actionCreators/preferredHeroes/preferredHeroes";
import { updateUser as updateUserAction } from "actionCreators/user";
import {
    addFilter as addFilterAction,
    removeFilter as removeFilterAction,
    removeAllFilters as removeAllFiltersAction
} from "actionCreators/heroFilters";
import {
    updateGroup as updateGroupAction
} from 'actionCreators/group/group';
import {
    addGroupInvite as addGroupInviteAction,
    removeGroupInvite as removeGroupInviteAction
} from 'actionCreators/groupInvites';
import {
    pushBlockingEvent as pushBlockingLoadingAction,
    popBlockingEvent as popBlockingLoadingAction,
} from "actionCreators/loading";
import {logout as logoutAction} from 'actionCreators/app';
import { syncClientAndServerHeroesAsync } from 'actionCreators/initialData/syncClientAndServerHeroesAsync';
import { updatePreferredHeroesAsync } from 'actionCreators/preferredHeroes/updatePreferredHeroesAsync';
import { leaveGroupAsync } from 'actionCreators/group/leaveGroupAsync';
import {
    sendGroupInviteTrackingEvent,
    acceptGroupInviteTrackingEvent,
    socketDisconnectTrackingEvent
} from 'actionCreators/googleAnalytic/googleAnalytic';


import * as Notifications from 'components/Notifications/Notifications';
const clientEvents = require('shared/libs/socketEvents/clientEvents');
import Raven from 'raven-js';

let socket;
let store;

const initialize = function(passedSocket, passedStore) {
    store = passedStore;
    socket = passedSocket;

    //Popped in syncClientAndServerHeroesAsync()
    store.dispatch(pushBlockingLoadingAction());

    socket.on(clientEvents.initialData, (heroesFromServer) => store.dispatch(syncClientAndServerHeroesAsync(heroesFromServer, socket)));
    socket.on(clientEvents.heroAdded, (hero) => _addHeroToStore(hero));
    socket.on(clientEvents.heroRemoved, (hero) => _removeHeroFromStore(hero));

    socket.on(clientEvents.groupInviteReceived, (groupInviteObject) => _addGroupInviteToStore(groupInviteObject));
    socket.on(clientEvents.playerInvited, (groupInviteObject) => _updateGroupInStore(groupInviteObject));
    socket.on(clientEvents.groupInviteCanceled, (groupInviteObject) => _removeGroupInviteFromStore(groupInviteObject));
    socket.on(clientEvents.playerInviteCanceled, (groupInviteObject) => _updateGroupInStore(groupInviteObject));

    socket.on(clientEvents.newGroupCreated, (groupInviteObject) => _updateGroupInStore(groupInviteObject));
    socket.on(clientEvents.groupInviteDeclined, (groupInviteObject) => _updateGroupInStore(groupInviteObject));
    socket.on(clientEvents.groupInviteAccepted, (groupInviteObject) => _handleGroupInviteAccepted(groupInviteObject));
    socket.on(clientEvents.groupPromotedLeader, (groupInviteObject) => _handleGroupPromotedLeader(groupInviteObject));
    socket.on(clientEvents.playerHeroLeft, (groupInviteObject) => _updateGroupInStore(groupInviteObject));

    socket.on(clientEvents.disconnect, () => _handleSocketDisconnect());

    socket.on(clientEvents.error.addHero, _addHeroErrorHandler);
    socket.on(clientEvents.error.groupLeave, _groupErrorHandler);
    socket.on(clientEvents.error.groupInviteAccept, _groupErrorHandler);
    socket.on(clientEvents.error.groupInviteCancel, _groupErrorHandler);
    socket.on(clientEvents.error.groupInviteDecline, _groupErrorHandler);
    socket.on(clientEvents.error.authenticate, _logout);
};

const addHeroFilterToStore = function(filter) {
    store.dispatch(addFilterAction(filter));
};

const removeHeroFilterFromStore = function(filter) {
    store.dispatch(removeFilterAction(filter));
};

const removeAllHeroFiltersFromStore = function() {
    store.dispatch(removeAllFiltersAction());
};

const removePreferredHeroFromStore = function(heroName, preference) {
    store.dispatch(removePreferredHeroAction(heroName, preference));
};

const updatePreferredHeroes = function(heroes) {
    store.dispatch(updatePreferredHeroesAsync(heroes, socket));
};

const updateUser = function(user) {
    store.dispatch(updateUserAction(user));
};

const inviteUserToGroup = function(userObject) {
    let platformDisplayName = store.getState().user.platformDisplayName;
    store.dispatch(sendGroupInviteTrackingEvent(platformDisplayName));
    Notifications.inviteSentNotification(userObject.platformDisplayName);
    socket.groupInviteSend(userObject);
};

const createNewGroup = function() {
    socket.createGroup(store.getState().preferredHeroes.heroes[0]);
};

const leaveGroup = function() {
    store.dispatch(leaveGroupAsync(socket));
};

const cancelInvite = function(userObject) {
    socket.groupInviteCancel(userObject);
};

const acceptGroupInviteAndRemoveFromStore = function(groupInviteObject) {
    _removeGroupInviteFromStore(groupInviteObject);
    Notifications.joinedGroupNotification(groupInviteObject.leader.platformDisplayName);
    socket.groupInviteAccept(groupInviteObject.groupId);
};

const declineGroupInviteAndRemoveFromStore = function(groupInviteObject) {
    _removeGroupInviteFromStore(groupInviteObject);
    socket.groupInviteDecline(groupInviteObject.groupId);
};

const _addHeroToStore = function(hero) {
    store.dispatch(addHeroAction(hero));
    if (hero.platformDisplayName === store.getState().user.platformDisplayName) {
        //Pushed in updatePreferredHeroesAsync()
        store.dispatch(popBlockingLoadingAction());
    }

    if (store.getState().preferredHeroes.heroes[0] === hero.heroName) {
        createNewGroup(store.getState().preferredHeroes.heroes[0]);
    }
};

const _removeHeroFromStore = function(hero) {
    store.dispatch(removeHeroAction(hero));
};

const _addHeroErrorHandler = function(error) {
    Notifications.errorNotification(error.hero.heroName);
    Raven.captureException(error);
    removePreferredHeroFromStore(error.hero.heroName, error.hero.priority);
};

const _addGroupInviteToStore = function(groupInviteObject) {
    Notifications.inviteReceivedNotification(groupInviteObject.leader.platformDisplayName);
    store.dispatch(addGroupInviteAction(groupInviteObject));
};

const _removeGroupInviteFromStore = function(groupInviteObject) {
    store.dispatch(removeGroupInviteAction(groupInviteObject));
};

const _updateGroupInStore = function(groupInviteObject) {
    store.dispatch(updateGroupAction(groupInviteObject));
};

const _handleSocketDisconnect = () => {
    let user = store.getState().user;
    if (user) {
        let platformDisplayName = user.platformDisplayName;
        store.dispatch(socketDisconnectTrackingEvent(platformDisplayName));
        Notifications.disconnectedNotification();
        store.dispatch(pushBlockingLoadingAction());
    }
};

const _handleGroupInviteAccepted = (newGroup) => {
    let previouslyPendingMembers = store.getState().group.pending;

    if (previouslyPendingMembers.length > 0 && newGroup.members.length > 0) {
        let newMember = previouslyPendingMembers.find((pendingMember) => {
            return newGroup.members.find((member) => {
                return member.platformDisplayName === pendingMember.platformDisplayName;
            });
        });
        if(newMember) {
            Notifications.userJoinedGroupNotification(newMember.platformDisplayName);
        }
    }

    let platformDisplayName = store.getState().user.platformDisplayName;
    store.dispatch(acceptGroupInviteTrackingEvent(platformDisplayName));
    store.dispatch(updateGroupAction(newGroup));
};

const _handleGroupPromotedLeader = (newGroup) => {
    let newGroupLeader = newGroup.leader.platformDisplayName;
    Notifications.leaderLeftGroupNotification(newGroupLeader);
    store.dispatch(updateGroupAction(newGroup));
};

const _groupErrorHandler = (error) => {
    Raven.captureException(error);
    Notifications.errorNotification(error.message);
};

const _logout = () => {
    store.dispatch(logoutAction());
};

const Actions = {
    initialize,
    updatePreferredHeroes,
    addHeroFilterToStore,
    removeHeroFilterFromStore,
    removeAllHeroFiltersFromStore,
    updateUser,
    leaveGroup,
    inviteUserToGroup,
    createNewGroup,
    cancelInvite,
    acceptGroupInviteAndRemoveFromStore,
    declineGroupInviteAndRemoveFromStore
};

export default Actions;