import { updateHeroes as updatePreferredHeroesAction } from "./preferredHeroes";
import { addHeroesToServerAsync } from '../heroes/addHeroesToServerAsync';
import {
    pushBlockingEvent as pushBlockingLoadingAction,
    popBlockingEvent as popBlockingLoadingAction
} from "../loading";

import fetchMostPlayedHeroesAsync from '../../api/heroApi/fetchMostPlayedHeroesAsync';

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
                throw Error("fetchMostPlayedHeroesAsync failed");
            });
    };
};
