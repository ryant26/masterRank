import { updateHeroes as updatePreferredHeroesAction } from "./preferredHeroes";
import { addHeroesToServer } from 'actionCreators/heroes/addHeroesToServer';
import {
    pushBlockingEvent as pushBlockingLoadingAction,
    popBlockingEvent as popBlockingLoadingAction
} from "actionCreators/loading";

import fetchMostPlayedHeroes from 'api/heroApi/fetchMostPlayedHeroes';

export const preferMostPlayedHeroes = (forUser, accessToken, socket) => {

    return (dispatch) => {

        dispatch(pushBlockingLoadingAction());

        fetchMostPlayedHeroes(forUser)
            .then(mostPlayedHeroesArray => {
                if( mostPlayedHeroesArray.length > 0) {
                    let mostPlayedHeroNames = mostPlayedHeroesArray.map((hero) => hero.heroName);
                    dispatch(updatePreferredHeroesAction(mostPlayedHeroNames));
                    dispatch(addHeroesToServer(mostPlayedHeroNames, socket));
                }
                dispatch(popBlockingLoadingAction());
            })
            .catch(() => {
                dispatch(popBlockingLoadingAction());
                throw Error("fetchMostPlayedHeroes failed");
            });
    };
};
