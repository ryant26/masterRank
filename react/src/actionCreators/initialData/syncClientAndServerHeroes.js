import {
    addHero as addHeroAction,
    clearAllHeroes as clearAllHeroesAction
} from 'actionCreators/heroes/hero';
import {
    popBlockingEvent as popBlockingLoadingAction,
} from 'actionCreators/loading';
import { preferMostPlayedHeroes } from 'actionCreators/preferredHeroes/preferMostPlayedHeroes';
import { addHeroesToServer } from 'actionCreators/heroes/addHeroesToServer';

import NotRealHeroes from 'resources/metaListFillerHeroes';
import { autoPreferredNotification } from 'components/Notifications/Notifications';

export const syncClientAndServerHeroes = (heroesFromServer, socket) => {

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
            autoPreferredNotification();
            dispatch(preferMostPlayedHeroes(user, localStorage.getItem('accessToken'), socket));
        } else {
            dispatch(addHeroesToServer(heroes, socket));
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