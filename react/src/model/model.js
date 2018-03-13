import {
    addHero as addHeroAction,
    removeHero as removeHeroAction,
} from "../actionCreators/heroes/hero";
import {
    removeHero as removePreferredHeroAction,
    updateHeroes as updatePreferredHeroesAction
} from "../actionCreators/preferredHeroes/preferredHeroes";
import { updateUser as updateUserAction } from "../actionCreators/user";
import {
    addFilter as addFilterAction,
    removeFilter as removeFilterAction,
    removeAllFilters as removeAllFiltersAction
} from "../actionCreators/heroFilters";
import {
    updateGroup as updateGroupAction,
    leaveGroup as leaveGroupAction
} from '../actionCreators/group';
import { clientEvents } from "../api/websocket";
import {
    addGroupInvite as addGroupInviteAction,
    removeGroupInvite as removeGroupInviteAction
} from '../actionCreators/groupInvites';
import {
    pushBlockingEvent as pushBlockingLoadingAction,
    popBlockingEvent as popBlockingLoadingAction,
} from "../actionCreators/loading";
import { syncClientAndServerHeroesAsync } from '../actionCreators/initialData/syncClientAndServerHeroesAsync';

import * as Notifications from '../components/Notifications/Notifications';


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

const updatePreferredHeroesInStore = function(heroes) {
    store.dispatch(updatePreferredHeroesAction(heroes));
};

const updatePreferredHeroes = function(heroes) {
    let currentPreferredHeroes = store.getState().preferredHeroes.heroes;
    let numberOfHeroesToCheck = Math.max(heroes.length, currentPreferredHeroes.length);

    for (let i = 0; i < numberOfHeroesToCheck; i++) {
        let currentPreferredHero = store.getState().preferredHeroes.heroes[i];
        let newPreferredHero = heroes[i];

        if (currentPreferredHero !== newPreferredHero){
            if (currentPreferredHero) {
                socket.removeHero(currentPreferredHero);
            }

            if (newPreferredHero) {
                Notifications.preferredHeroNotification(newPreferredHero);
                socket.addHero(newPreferredHero, i+1);
                //Popped in _addHeroToStore()
                store.dispatch(pushBlockingLoadingAction());
            }
        }
    }

    updatePreferredHeroesInStore(heroes);
};

const updateUser = function(user) {
    store.dispatch(updateUserAction(user));
};

const inviteUserToGroup = function(userObject) {
    Notifications.inviteSentNotification(userObject.platformDisplayName);
    socket.groupInviteSend(userObject);
};

const createNewGroup = function() {
    socket.createGroup(store.getState().preferredHeroes.heroes[0]);
};

const leaveGroup = function() {
    const user = store.getState().user;
    const group = store.getState().group;
    if( !(group.leader.platformDisplayName === user.platformDisplayName && group.members.length === 0) ) {
        Notifications.successfullyLeftGroupNotification(group.leader.platformDisplayName);
    }
    store.dispatch(leaveGroupAction());
    socket.groupLeave();
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
        //Pushed in updatePreferredHeroes()
        store.dispatch(popBlockingLoadingAction());
    }

    if (store.getState().preferredHeroes.heroes[0] === hero.heroName) {
        createNewGroup(store.getState().preferredHeroes.heroes[0]);
    }
};

const _removeHeroFromStore = function(hero) {
    store.dispatch(removeHeroAction(hero));
    //TODO: Multiple tabs or window messes up preferred heroes. 
    if (hero.platformDisplayName === store.getState().user.platformDisplayName) {
        removePreferredHeroFromStore(hero.heroName, hero.priority);
    }
};

const _addHeroErrorHandler = function(error) {
    Notifications.errorNotification(error.heroName);
    //TODO: implement logic to remove error.heroName from users preferred hereos. Need to modify error, to send {heroName, priority}
    // removePreferredHeroFromStore(error.heroName, error.priority);
    // Do whatever we do to shuffle heroes in the case that multiple were added
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
    Notifications.disconnectedNotification();
    store.dispatch(pushBlockingLoadingAction());
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

    store.dispatch(updateGroupAction(newGroup));
};

const _handleGroupPromotedLeader = (newGroup) => {
    let newGroupLeader = newGroup.leader.platformDisplayName;
    Notifications.leaderLeftGroupNotification(newGroupLeader);
    store.dispatch(updateGroupAction(newGroup));
};

const _groupErrorHandler = (error) => {
    Notifications.errorNotification(error.message);
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