import { addHero as addHeroAction,
    addHeroes as addHeroesAction,
    removeHero as removeHeroAction
} from "../actions/hero";
import {
    addHero as addPreferredHeroAction,
    removeHero as removePreferredHeroAction,
    updateHeroes as updatePreferredHeroesAction
} from "../actions/preferredHeroes";
import { updateUser as updateUserAction } from "../actions/user";
import {
    addFilter as addFilterAction,
    removeFilter as removeFilterAction,
    removeAllFilters as removeAllFiltersAction
} from "../actions/heroFilters";
import { updateGroup as updateGroupAction } from '../actions/group';
import { clientEvents } from "../api/websocket";
import {
    addGroupInvite as addGroupInviteAction,
    removeGroupInvite as removeGroupInviteAction
} from '../actions/groupInvites';

let socket;
let store;

const initialize = function(passedSocket, passedStore) {
    store = passedStore;
    socket = passedSocket;

    socket.on(clientEvents.initialData, () => loadPreferredHeroesFromLocalStorage());
    socket.on(clientEvents.initialData, (players) => _addHeroesToStore(players));
    socket.on(clientEvents.heroAdded, (hero) => _addHeroToStore(hero));
    socket.on(clientEvents.heroRemoved, (hero) => _removeHeroFromStore(hero));
    socket.on(clientEvents.groupInviteReceived, (groupInviteReceivedObject) => _addGroupInvite(groupInviteReceivedObject));
    socket.on(clientEvents.groupInviteCanceled, (groupInviteCanceledObject) => _removeGroupInviteAction(groupInviteCanceledObject));
    socket.on(clientEvents.groupPromotedLeader, (promotedLeaderObject) => _updateGroupData(promotedLeaderObject));
    socket.on(clientEvents.playerInvited, (groupInvitePendingObject) => _updateGroupData(groupInvitePendingObject));
    socket.on(clientEvents.groupHeroLeft, (groupHeroLeftObject) => _updateGroupData(groupHeroLeftObject));        
    socket.on(clientEvents.groupInviteCanceled, (groupHeroCancelledObject) => _updateGroupData(groupHeroCancelledObject));
    
    socket.on(clientEvents.error.addHero, _addHeroErrorHandler);
    socket.on(clientEvents.error.groupLeave, _groupLeaveErrorHandler);    
    socket.on(clientEvents.error.groupInviteCancel, _groupCancelErrorHandler);
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

const addPreferredHero = function(heroName, preference) {
    socket.addHero(heroName, preference);
    addPreferredHeroToStore(heroName, preference);
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

const _addHeroToStore = function(hero) {
    store.dispatch(addHeroAction(hero));
    if (hero.platformDisplayName === store.getState().user.platformDisplayName) {
        addPreferredHeroToStore(hero.heroName, hero.preference);
    }

    // this logic also needs to check when user changes his/her preferred hero
    // will need a server event to promote this users new hero as the leader
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

const _addHeroesToStore = function(heroes) {
    store.dispatch(addHeroesAction(heroes));
    heroes.forEach((hero) => {
        if (hero.platformDisplayName === store.getState().user.platformDisplayName) {
            addPreferredHeroToStore(hero.heroName, hero.preference);
        }
    });
};

const _addHeroErrorHandler = function(err) {
    removePreferredHeroFromStore(err.heroName);
    // Do whatever we do to shuffle heroes in the case that multiple were added
    // After this one
};

const _addGroupInvite = function(groupInviteObject) {
    store.dispatch(addGroupInviteAction(groupInviteObject));
};

const _removeGroupInviteAction = function(groupInviteObject) {
    store.dispatch(removeGroupInviteAction(groupInviteObject));
};
const _updateGroupData = function(updatedGroupData) {
    store.dispatch(updateGroupAction(updatedGroupData));
};

/*eslint no-console: ["error", { allow: ["log", "error"] }] */
const _groupLeaveErrorHandler = function(err) {
    console.error(err.groupId);
};

/*eslint no-console: ["error", { allow: ["log", "error"] }] */
const _groupCancelErrorHandler = function(err) {
    console.error(err.groupId);
};

const loadPreferredHeroesFromLocalStorage = () => {
    let preferredHeroes = store.getState().preferredHeroes.heroes;
    preferredHeroes.forEach((hero, key) => {
        addPreferredHero(hero, (key+1));
    });
};

const Actions = {
    initialize,
    addPreferredHero,
    updatePreferredHeroes,
    addHeroFilterToStore,
    removeHeroFilterFromStore,
    removeAllHeroFiltersFromStore,
    updateUser,
    leaveGroup,
    inviteUserToGroup,
    createNewGroup,
    cancelInvite
};

export default Actions;