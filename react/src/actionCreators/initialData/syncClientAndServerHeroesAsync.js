import {
    addHero as addHeroAction,
    clearAllHeroes as clearAllHeroesAction
} from 'actionCreators/heroes/hero';
import {
    popBlockingEvent as popBlockingLoadingAction,
} from "actionCreators/loading";
import { preferMostPlayedHeroesAsync } from 'actionCreators/preferredHeroes/preferMostPlayedHeroesAsync';
import { addHeroesToServerAsync } from 'actionCreators/heroes/addHeroesToServerAsync';
import { updateHeroes as updatePreferredHeroes } from 'actionCreators/preferredHeroes/preferredHeroes';

import NotRealHeroes from 'resources/metaListFillerHeroes';

export const syncClientAndServerHeroesAsync = (heroesFromServer, socket) => {

    return (dispatch, getState) => {

        dispatch(clearAllHeroesAction());
        _loadMetaListFillerHeroes(dispatch);

        let serverPreferredHeroes = [];

        let user = getState().user;
        heroesFromServer.forEach((hero) => {
            dispatch(addHeroAction(hero));

            if (hero.platformDisplayName === user.platformDisplayName)  {
                serverPreferredHeroes.push(hero);
            }
        });

        serverPreferredHeroes.sort((a, b) => a.priority > b.priority);
        serverPreferredHeroes = serverPreferredHeroes.map((hero) => hero.heroName);

        let localPreferredHeroes = getState().preferredHeroes.heroes;

        if( !localPreferredHeroes.length && !serverPreferredHeroes.length) {
            dispatch(preferMostPlayedHeroesAsync(user, localStorage.getItem('accessToken'), socket));
        } else if (serverPreferredHeroes.length) {
            dispatch(updatePreferredHeroes(serverPreferredHeroes));
        } else {
            dispatch(addHeroesToServerAsync(localPreferredHeroes, socket));
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