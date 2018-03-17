import {
    addHero as addHeroAction,
    clearAllHeroes as clearAllHeroesAction
} from 'actionCreators/heroes/hero';
import {
    popBlockingEvent as popBlockingLoadingAction,
} from "actionCreators/loading";
import { preferMostPlayedHeroesAsync } from 'actionCreators/preferredHeroes/preferMostPlayedHeroesAsync';
import { addHeroesToServerAsync } from 'actionCreators/heroes/addHeroesToServerAsync';

import NotRealHeroes from 'resources/metaListFillerHeroes';

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
    };
};

const _loadMetaListFillerHeroes = (dispatch) => {
    NotRealHeroes.forEach((hero) => {
        dispatch(addHeroAction(hero));
    });
};