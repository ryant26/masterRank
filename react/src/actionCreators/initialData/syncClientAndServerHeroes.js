import {
    addHero as addHeroAction,
    clearAllHeroes as clearAllHeroesAction
} from "../heroes/hero";
import {
    pushBlockingEvent as pushBlockingLoadingAction,
    popBlockingEvent as popBlockingLoadingAction,
} from "../loading";
import { preferMostPlayedHeroes } from '../preferredHeroes/preferMostPlayedHeroes';
import { addHeroesToServer } from '../heroes/addHeroesToServer';

import NotRealHeroes from '../../resources/metaListFillerHeroes';
import { autoPreferredNotification } from '../../components/Notifications/Notifications';

export const syncClientAndServerHeroes = (heroesFromServer, socket) => {

    return (dispatch, getState) => {

        dispatch(pushBlockingLoadingAction());
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
            autoPreferredNotification();
            dispatch(preferMostPlayedHeroes(user, localStorage.getItem('accessToken'), socket));
        } else {
            dispatch(addHeroesToServer(heroes, socket));
        }

        dispatch(popBlockingLoadingAction());
    };
};

const _loadMetaListFillerHeroes = (dispatch) => {
    NotRealHeroes.forEach((hero) => {
        dispatch(addHeroAction(hero));
    });
};