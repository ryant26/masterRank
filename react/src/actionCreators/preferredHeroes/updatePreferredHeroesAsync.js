import { preferredHeroNotification } from 'components/Notifications/Notifications';
import { updateHeroes as updatePreferredHeroesAction } from "actionCreators/preferredHeroes/preferredHeroes";
import { pushBlockingEvent as pushBlockingLoadingAction } from "actionCreators/loading";
import { updatePreferredHeroesTrackingEvent } from 'actionCreators/googleAnalytic/googleAnalytic';

export const updatePreferredHeroesAsync = function(heroes, socket) {

    return (dispatch, getState) => {

        let currentPreferredHeroes = getState().preferredHeroes.heroes;
        let numberOfHeroesToCheck = Math.max(heroes.length, currentPreferredHeroes.length);

        let heroesToRemoveFromServer = [];
        let heroesToAddToServer = [];

        for (let i = 0; i < numberOfHeroesToCheck; i++) {
            let currentPreferredHero = getState().preferredHeroes.heroes[i];
            let newPreferredHero = heroes[i];

            if (currentPreferredHero !== newPreferredHero){
                if (currentPreferredHero) {
                    heroesToRemoveFromServer.push(currentPreferredHero);
                }

                if (newPreferredHero) {
                    heroesToAddToServer.push({hero: newPreferredHero, priority: i+1});
                }
            }
        }

        heroesToRemoveFromServer.forEach((hero) => {
            socket.removeHero(hero);
        });

        heroesToAddToServer.forEach(({hero, priority}) => {
            socket.addHero(hero, priority);
            preferredHeroNotification(hero);

            //Popped in modle.js _addHeroToStore()
            dispatch(pushBlockingLoadingAction());
        });

        dispatch(updatePreferredHeroesAction(heroes));
        dispatch(updatePreferredHeroesTrackingEvent());
    };
};