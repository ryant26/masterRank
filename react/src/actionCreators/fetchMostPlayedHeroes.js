import { updateHeroes as updatePreferredHeroesAction } from "./preferredHeroes";
import { addHeroesToServer } from './addHeroesToServer';
import {
    pushBlockingEvent as pushBlockingLoadingAction,
    popBlockingEvent as popBlockingLoadingAction
} from "./loading";

export function fetchMostPlayedHeroes(forUser, accessToken, socket) {

    return (dispatch) => {

        dispatch(pushBlockingLoadingAction());

        let platformDisplayName = forUser.platformDisplayName.replace(/#/g, '-');
        const apiUrl = `/api/heros?platformDisplayName=${platformDisplayName}&platform=${forUser.platform}&region=${forUser.region}&filterBy=top&limit=5`;
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