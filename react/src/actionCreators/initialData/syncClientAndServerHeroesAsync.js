import {
    addHero as addHeroAction,
    clearAllHeroes as clearAllHeroesAction
} from "../heroes/hero";
import {
    popBlockingEvent as popBlockingLoadingAction,
} from "../loading";
import { preferMostPlayedHeroesAsync } from '../preferredHeroes/preferMostPlayedHeroesAsync';
import { addHeroesToServerAsync } from '../heroes/addHeroesToServerAsync';
import { runWalkthrough } from '../walkthrough/walkthrough';

import NotRealHeroes from '../../resources/metaListFillerHeroes';

export const syncClientAndServerHeroesAsync = (heroesFromServer, socket) => {

    return (dispatch, getState) => {

        dispatch(clearAllHeroesAction());
        _loadMetaListFillerHeroes(dispatch);

        let user = getState().user;
        heroesFromServer.forEach((hero) => {
            if(hero.platformDisplayName !== user.platformDisplayName){
                dispatch(addHeroAction(hero));
            } else  {
                socket.removeHero(hero.heroName);
            }
        });

        let heroes = getState().preferredHeroes.heroes;
        if( heroes.length <= 0) {
            dispatch(preferMostPlayedHeroesAsync(user, localStorage.getItem('accessToken'), socket));
        } else {
            dispatch(addHeroesToServerAsync(heroes, socket));
        }

        //Pushed in models.initialize
        dispatch(popBlockingLoadingAction());
        dispatch(runWalkthrough());
    };
};

const _loadMetaListFillerHeroes = (dispatch) => {
    NotRealHeroes.forEach((hero) => {
        dispatch(addHeroAction(hero));
    });
};