import {addGroupInvite} from "../actions/groupInvites";
import {addHero as addHeroAction, addHeroes as addHeroesAction} from "../actions/hero";
import {
    addHero as addPreferredHeroAction,
    removeHero as removePreferredHeroAction,
    setSelectedSlot as setSelectedSlotAction
} from "../actions/preferredHeroes";
import {updateUser as updateUserAction} from "../actions/user";
import {addFilter as addFilterAction, removeFilter as removeFilterAction} from "../actions/heroFilters";
import {clientEvents} from "../api/websocket";

let socket;
let store;

const initialize = function(passedSocket, passedStore) {
    store = passedStore;
    socket = passedSocket;

    socket.on(clientEvents.initialData, (players) => addHeroesToStore(players));
    socket.on(clientEvents.heroAdded, (hero) => addHeroToStore(hero));
    socket.on(clientEvents.error.addHero, addHeroErrorHandler);
    socket.on(clientEvents.groupInviteReceived, (invite) => addInviteToStore(invite));
    socket.on(clientEvents.authenticated, () => loadPreferredHeroesFromLocalStorage());
};

const addHeroFilterToStore = function(filter) {
    store.dispatch(addFilterAction(filter));
};

const removeHeroFilterFromStore = function(filter) {
    store.dispatch(removeFilterAction(filter));
};

const addHeroToStore = function(hero) {
    store.dispatch(addHeroAction(hero));
    if (hero.platformDisplayName === store.getState().user.platformDisplayName) {
        addPreferredHeroToStore(hero.heroName, hero.preference);
    }
};

const addHeroesToStore = function(heroes) {
    store.dispatch(addHeroesAction(heroes));
    heroes.forEach((hero) => {
        if (hero.platformDisplayName === store.getState().user.platformDisplayName) {
            addPreferredHeroToStore(hero.heroName, hero.preference);
        }
    });
};

const addPreferredHeroToStore = function(heroName, preference) {
    store.dispatch(addPreferredHeroAction(heroName, preference));
};

const removePreferredHeroFromStore = function(heroName) {
    store.dispatch(removePreferredHeroAction(heroName));
};

const addInviteToStore = function(invite) {
    store.dispatch(addGroupInvite(invite));
};

const addPreferredHero = function(heroName, preference) {
    socket.addHero(heroName, preference);
    addPreferredHeroToStore(heroName, preference);
};

const setSelectedSlotInStore = function (slot) {
    store.dispatch(setSelectedSlotAction(slot));
};

const updateUser = function(user) {
    store.dispatch(updateUserAction(user));
};

const addHeroErrorHandler = function(err) {
    removePreferredHeroFromStore(err.heroName);
    // Do whatever we do to shuffle heroes in the case that multiple were added
    // After this one
};

const loadPreferredHeroesFromLocalStorage = () => {
    //TODO: Ryan, does socket.addHero(heroName, preference), in the backend, check if the hero has been added yet?
    let preferredHeroes = store.getState().preferredHeroes.heroes;
    preferredHeroes.forEach((hero, key) => {
        addPreferredHero(hero, (key+1));
    });
};

const Actions = {
    initialize,
    addPreferredHero,
    addHeroFilterToStore,
    removeHeroFilterFromStore,
    setSelectedSlotInStore,
    updateUser
};

export default Actions;