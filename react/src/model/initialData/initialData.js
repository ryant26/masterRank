import {
    addHero as addHeroAction,
    clearAllHeroes as clearAllHeroesAction
} from "../../actionCreators/hero";

import { fetchMostPlayedHeroes } from '../../actionCreators/fetchMostPlayedHeroes';


import { popBlockingEvent as popBlockingLoadingAction } from "../../actionCreators/loading";

import { updateHeroes as updatePreferredHeroesAction } from "../../actionCreators/preferredHeroes";

import NotRealHeroes from '../../resources/metaListFillerHeroes';


let socket;
let store;

const handleInitialData = (passedSocket, passedStore, heroesFromServer) => {
    socket = passedSocket;
    store = passedStore;
    const user = store.getState().user;

    store.dispatch(clearAllHeroesAction());
    _loadMetaListFillerHeroes(store);

    heroesFromServer.forEach((hero) => {
        if(hero.platformDisplayName !== user.platformDisplayName){
            store.dispatch(addHeroAction(hero));
        } else  {
            socket.removeHero(hero.heroName);
        }
    });

    let heroes = store.getState().preferredHeroes.heroes;
    if( heroes.length <= 0) {
        store.dispatch(fetchMostPlayedHeroes(user, localStorage.getItem('accessToken'), socket));
//        _preferMostPlayedHeroes(user);
    } else {
        _prefer(heroes);
    }

    store.dispatch(popBlockingLoadingAction());
};


const _loadMetaListFillerHeroes = () => {
    NotRealHeroes.forEach((hero) => {
        store.dispatch(addHeroAction(hero));
    });
};

export default handleInitialData;