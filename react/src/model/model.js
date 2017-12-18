import {addGroupInvite} from "../actions/groupInvites";
import {addHero as addHeroAction, addHeroes as addHeroesAction} from "../actions/hero";
import {addHero as addPreferredHeroAction} from "../actions/preferredHeroes";
import {updateUser as updateUserAction} from "../actions/user";
import {clientEvents} from "../api/websocket";

let socket;
let store;

const initialize = function(passedSocket, passedStore) {
    store = passedStore;
    socket = passedSocket;

    socket.on(clientEvents.initialData, (players) => addHeroesToStore(players));
    socket.on(clientEvents.heroAdded, (hero) => addHeroToStore(hero));
    socket.on(clientEvents.groupInviteReceived, (invite) => addInviteToStore(invite));
};

const addHeroToStore = function(hero) {
    store.dispatch(addHeroAction(hero));
    addPreferredHeroToStore(hero);
};

const addHeroesToStore = function(heroes) {
    store.dispatch(addHeroesAction(heroes));
    heroes.map(addPreferredHeroToStore);
};

const addPreferredHeroToStore = function(hero) {
    if (hero.battleNetId === store.getState().user.battleNetId) {
        store.dispatch(addPreferredHeroAction(hero));
    }
};

const addInviteToStore = function(invite) {
    store.dispatch(addGroupInvite(invite));
};

const addPreferredHero = function(hero) {
    socket.addHero(hero);
    addHeroToStore(hero);
};

const updateUser = function(user) {
    store.dispatch(updateUserAction(user));
};

const Actions = {
    initialize,
    addPreferredHero,
    updateUser
};
export default Actions;