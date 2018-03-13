import { preferredHeroNotification } from '../../components/Notifications/Notifications';
import { updateHeroes as updatePreferredHeroesAction } from "./preferredHeroes";
import { pushBlockingEvent as pushBlockingLoadingAction } from "../loading";

export const updatePreferredHeroes = function(heroes, socket) {

    return (dispatch, getState) => {

        let currentPreferredHeroes = getState().preferredHeroes.heroes;
        let numberOfHeroesToCheck = Math.max(heroes.length, currentPreferredHeroes.length);

        for (let i = 0; i < numberOfHeroesToCheck; i++) {
            let currentPreferredHero = getState().preferredHeroes.heroes[i];
            let newPreferredHero = heroes[i];

            if (currentPreferredHero !== newPreferredHero){
                if (currentPreferredHero) {
                    socket.removeHero(currentPreferredHero);
                }

                if (newPreferredHero) {
                    preferredHeroNotification(newPreferredHero);
                    socket.addHero(newPreferredHero, i+1);
                    //Popped in modle.js _addHeroToStore()
                    dispatch(pushBlockingLoadingAction());
                }
            }
        }

        dispatch(updatePreferredHeroesAction(heroes));
    };
};