import {
    addHero as addHeroAction,
    removeHero as removeHeroAction,
    clearAllHeroes as clearAllHeroesAction
} from "../actionCreators/hero";
import {
    addHero as addPreferredHeroAction,
    removeHero as removePreferredHeroAction,
    updateHeroes as updatePreferredHeroesAction
} from "../actionCreators/preferredHeroes";
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

import {
    joinedGroupNotification,
    userJoinedGroupNotification,
    inviteSentNotification,
    inviteReceivedNotification,
    successfullyLeftGroupNotification,
    errorNotification
} from '../components/Notifications/Notifications';

import NotRealHeroes from '../resources/metaListFillerHeroes';

let socket;
let store;

const initialize = function(passedSocket, passedStore) {
    store = passedStore;
    socket = passedSocket;

    store.dispatch(pushBlockingLoadingAction());

    socket.on(clientEvents.initialData, (heroesFromServer) => _handleInitialData(heroesFromServer));
    socket.on(clientEvents.heroAdded, (hero) => _addHeroToStore(hero));
    socket.on(clientEvents.heroRemoved, (hero) => _removeHeroFromStore(hero));

    socket.on(clientEvents.groupInviteReceived, (groupInviteObject) => _addGroupInviteToStore(groupInviteObject));
    socket.on(clientEvents.playerInvited, (groupInviteObject) => _updateGroupInStore(groupInviteObject));

    socket.on(clientEvents.groupInviteCanceled, (groupInviteObject) => _removeGroupInviteFromStore(groupInviteObject));
    socket.on(clientEvents.playerInviteCanceled, (groupInviteObject) => _updateGroupInStore(groupInviteObject));

    socket.on(clientEvents.groupInviteDeclined, (groupInviteObject) => _updateGroupInStore(groupInviteObject));
    socket.on(clientEvents.groupInviteAccepted, (groupInviteObject) => _handleGroupInviteAccepted(groupInviteObject));
    socket.on(clientEvents.groupPromotedLeader, (groupInviteObject) => _updateGroupInStore(groupInviteObject));
    socket.on(clientEvents.playerHeroLeft, (groupInviteObject) => _updateGroupInStore(groupInviteObject));

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

const addPreferredHeroToStore = function(heroName, preference) {
    store.dispatch(addPreferredHeroAction(heroName, preference));
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
                socket.addHero(newPreferredHero, i+1);
            }
        }
    }

    updatePreferredHeroesInStore(heroes);
};

const updateUser = function(user) {
    store.dispatch(updateUserAction(user));
};

const inviteUserToGroup = function(userObject) {
    inviteSentNotification(userObject.platformDisplayName);
    socket.groupInviteSend(userObject);
};

const createNewGroup = function() {
    socket.createGroup(store.getState().preferredHeroes.heroes[0]);
};

const leaveGroup = function() {
    successfullyLeftGroupNotification(store.getState().group.leader.platformDisplayName);
    store.dispatch(leaveGroupAction());
    socket.groupLeave();
};

const cancelInvite = function(userObject) {
    socket.groupInviteCancel(userObject);
};

const acceptGroupInviteAndRemoveFromStore = function(groupInviteObject) {
    _removeGroupInviteFromStore(groupInviteObject);
    joinedGroupNotification(groupInviteObject.leader.platformDisplayName);
    socket.groupInviteAccept(groupInviteObject.groupId);
};

const declineGroupInviteAndRemoveFromStore = function(groupInviteObject) {
    _removeGroupInviteFromStore(groupInviteObject);
    socket.groupInviteDecline(groupInviteObject.groupId);
};

const loadMetaListFillerHeroes = () => {
    NotRealHeroes.forEach((hero) => {
        _addHeroToStore(hero);
    });
};

const _handleInitialData = function(heroesFromServer) {
    store.dispatch(clearAllHeroesAction());
    loadMetaListFillerHeroes();

    let userPlatformDisplayName = store.getState().user.platformDisplayName;
    heroesFromServer.forEach((hero) => {
        if(hero.platformDisplayName !== userPlatformDisplayName){
            store.dispatch(addHeroAction(hero));
        } else  {
            socket.removeHero(hero.heroName);
        }
    });

    store.getState().preferredHeroes.heroes.forEach((heroName, i) => {
         socket.addHero(heroName, (i+1));
    });

    store.dispatch(popBlockingLoadingAction());
};

const _addHeroToStore = function(hero) {
    store.dispatch(addHeroAction(hero));
    if (hero.platformDisplayName === store.getState().user.platformDisplayName) {
        addPreferredHeroToStore(hero.heroName, hero.preference);
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
    errorNotification(error.heroName);
    removePreferredHeroFromStore(error.heroName);
    // Do whatever we do to shuffle heroes in the case that multiple were added
    // After this one
};

const _addGroupInviteToStore = function(groupInviteObject) {
    inviteReceivedNotification(groupInviteObject.leader.platformDisplayName);
    store.dispatch(addGroupInviteAction(groupInviteObject));
};

const _removeGroupInviteFromStore = function(groupInviteObject) {
    store.dispatch(removeGroupInviteAction(groupInviteObject));
};

const _updateGroupInStore = function(groupInviteObject) {
    store.dispatch(updateGroupAction(groupInviteObject));
};

const _handleGroupInviteAccepted = (newGroup) => {
    //TODO: is there a better way to get the new group member?
    let previouslyPendingMembers = store.getState().group.pending;

    if (previouslyPendingMembers.length > 0 && newGroup.members.length > 0) {
        let newMember = previouslyPendingMembers.find((pendingMember) => {
            return newGroup.members.find((member) => {
                return member.platformDisplayName === pendingMember.platformDisplayName;
            });
        });
        //TODO: this if statement should never not trigger. If it does trigger that means something went wrong.
        // Should i sent a generic user joined group message or just not send a message?
        if(newMember) {
            userJoinedGroupNotification(newMember.platformDisplayName);
        }
    }

    store.dispatch(updateGroupAction(newGroup));
};

const _groupErrorHandler = (error) => {
    errorNotification(error.message);
};

const Actions = {
    initialize,
    addPreferredHeroToStore,
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