import { updateHeroes as updatePreferredHeroesAction } from "actionCreators/preferredHeroes/preferredHeroes";
import { addHeroesToServerAsync } from 'actionCreators/heroes/addHeroesToServerAsync';
import {
    pushBlockingEvent as pushBlockingLoadingAction,
    popBlockingEvent as popBlockingLoadingAction
} from 'actionCreators/loading';
import Raven from 'raven-js';

import fetchMostPlayedHeroesAsync from 'api/heroApi/fetchMostPlayedHeroesAsync';

export const preferMostPlayedHeroesAsync = (forUser, accessToken, socket) => {

    return (dispatch) => {

        dispatch(pushBlockingLoadingAction());

        fetchMostPlayedHeroesAsync(forUser)
            .then(mostPlayedHeroesArray => {
                if( mostPlayedHeroesArray.length > 0) {
                    let mostPlayedHeroNames = mostPlayedHeroesArray.map((hero) => hero.heroName);
                    dispatch(updatePreferredHeroesAction(mostPlayedHeroNames));
                    dispatch(addHeroesToServerAsync(mostPlayedHeroNames, socket));
                }
                dispatch(popBlockingLoadingAction());
            })
            .catch(() => {
                dispatch(popBlockingLoadingAction());
                Raven.captureException(Error("fetchMostPlayedHeroesAsync failed"));
                throw Error("fetchMostPlayedHeroesAsync failed");
            });
    };
};
