import { updateHeroes as updatePreferredHeroesAction } from "./preferredHeroes";
import { addHeroesToServer } from '../heroes/addHeroesToServer';
import {
    pushBlockingEvent as pushBlockingLoadingAction,
    popBlockingEvent as popBlockingLoadingAction
} from "../loading";

import fetchMostPlayedHeroes from '../../api/heroApi/fetchMostPlayedHeroes';

export const preferMostPlayedHeroes = (forUser, accessToken, socket) => {

    return (dispatch) => {

        dispatch(pushBlockingLoadingAction());

        fetchMostPlayedHeroes(forUser)
            .then(heroesArray => {
                if( heroesArray.length > 0) {
                    let mostPlayedHeroes = heroesArray.map((hero) => hero.heroName);
                    dispatch(updatePreferredHeroesAction(mostPlayedHeroes));
                    dispatch(addHeroesToServer(mostPlayedHeroes, socket));
                    dispatch(popBlockingLoadingAction());
                }
            })
            .catch(() => {
                dispatch(popBlockingLoadingAction());
                throw Error("fetchMostPlayedHeroes failed");
            });
    };
}
