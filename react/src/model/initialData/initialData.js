import {
    addHero as addHeroAction,
    clearAllHeroes as clearAllHeroesAction
} from "../../actionCreators/hero";

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
        _preferMostPlayedHeroes(user);
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

const _preferMostPlayedHeroes = (user) => {
    let platformDisplayName = user.platformDisplayName.replace(/#/g, '-');
    const apiUrl = `/api/heros?platformDisplayName=${platformDisplayName}&platform=${user.platform}&region=${user.region}&filterBy=top&limit=5`;
    const headers = {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `bearer ${localStorage.getItem('accessToken')}`
    }};

    fetch(apiUrl, headers)
        .then(response => {
            if (!response.ok) {
                throw Error("Network request failed");
            }
            return response;
        })
        .then(response => response.json())
        .then(heroesArray => {
            if( heroesArray.length > 0) {
                let mostPlayedHeroes = heroesArray.map((hero) => hero.heroName);
                _prefer(mostPlayedHeroes);
                store.dispatch(updatePreferredHeroesAction(mostPlayedHeroes));
            }
        });
};

const _prefer = (heroes) => {
    heroes.forEach((heroName, i) => {
         socket.addHero(heroName, (i+1));
    });
};

export default handleInitialData;