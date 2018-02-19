import {
    addHero as addHeroAction,
    removeHero as removeHeroAction
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
import { updateGroup as updateGroupAction } from '../actionCreators/group';
import { clientEvents } from "../api/websocket";
import {
    addGroupInvite as addGroupInviteAction,
    removeGroupInvite as removeGroupInviteAction
} from '../actionCreators/groupInvites';
import {
    pushBlockingEvent as pushBlockingLoadingAction,
    popBlockingEvent as popBlockingLoadingAction,
} from "../actionCreators/loading";

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
    socket.on(clientEvents.groupInviteDeclined, (groupInviteObject) => _updateGroupInStore(groupInviteObject));
    socket.on(clientEvents.groupInviteCanceled, (groupInviteObject) => _updateGroupInStore(groupInviteObject));
    socket.on(clientEvents.groupInviteAccepted, (groupInviteObject) => _updateGroupInStore(groupInviteObject));
    socket.on(clientEvents.groupPromotedLeader, (groupInviteObject) => _updateGroupInStore(groupInviteObject));
    socket.on(clientEvents.groupHeroLeft, (groupInviteObject) => _updateGroupInStore(groupInviteObject));

    socket.on(clientEvents.error.addHero, _addHeroErrorHandler);
    socket.on(clientEvents.error.groupLeave, _groupErrorHandler);
    socket.on(clientEvents.error.groupInviteAccept, _groupErrorHandler);
    socket.on(clientEvents.error.groupInviteCancel, _groupErrorHandler);
    socket.on(clientEvents.error.groupInviteDeclined, _groupErrorHandler);
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

const createNewGroup = function(userHeroName) {
    socket.createGroup(userHeroName);
};

const inviteUserToGroup = function(userObject) {
    socket.groupInviteSend(userObject);
};

const leaveGroup = function(groupId) {
    socket.groupLeave(groupId);
};

const cancelInvite = function(userObject) {
    socket.groupInviteCancel(userObject);
};

const acceptGroupInviteAndRemoveFromStore = function(groupInviteObject) {
    store.dispatch(removeGroupInviteAction(groupInviteObject));
    socket.groupInviteAccept(groupInviteObject.groupId);
};

const declineGroupInviteAndRemoveFromStore = function(groupInviteObject) {
    store.dispatch(removeGroupInviteAction(groupInviteObject));
    socket.groupInviteDecline(groupInviteObject.groupId);
};

const _handleInitialData = function(heroesFromServer) {
    //TODO: create an action to clear heroes from store
    store.getState().heroes.forEach((hero) => {
        store.dispatch(removeHeroAction(hero));
    });

    let userPlatformDisplayName = store.getState().user.platformDisplayName;
    let localPreferredHeroNames = Object.create(store.getState().preferredHeroes.heroes);

    let preference = 1;
    heroesFromServer.forEach((hero) => {
        if(hero.platformDisplayName === userPlatformDisplayName) {
            let index = localPreferredHeroNames.indexOf(hero.heroName);
            if(index < 0) {
                socket.removeHero(hero.heroName);
            } else {
                localPreferredHeroNames.splice(index,1);
                store.dispatch(addHeroAction(hero));
                preference++;
            }
        } else {
            store.dispatch(addHeroAction(hero));
        }
    });

    localPreferredHeroNames.forEach((heroName) => {
         socket.addHero(heroName, preference);
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
    if (hero.platformDisplayName === store.getState().user.platformDisplayName) {
        removePreferredHeroFromStore(hero.heroName, hero.priority);
    }
};

const _addHeroErrorHandler = function(err) {
    removePreferredHeroFromStore(err.heroName);
};

const _addGroupInviteToStore = function(groupInviteObject) {
    store.dispatch(addGroupInviteAction(groupInviteObject));
};

const _updateGroupInStore = function(groupInviteObject) {
    store.dispatch(updateGroupAction(groupInviteObject));
};

/*eslint no-console: ["error", { allow: ["log", "error"] }] */
const _groupErrorHandler = (err) => {
    console.error(err.groupId);
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