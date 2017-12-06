import * as HeroActionTypes from '../actiontypes/hero';
import HEROES from '../resources/heroes';

const initialState = [...HEROES];

const isDuplicate = function(state, hero) {
    return state.some((storeHero) => {
        return hero.battleNetId === storeHero.battleNetId
            && hero.heroName === storeHero.heroName;
    });
};


export default function HeroReducer(state=initialState, action) {
  switch(action.type) {
      case HeroActionTypes.ADD_HERO: {
          let out = state;
          if (!isDuplicate(out, action.hero)) {
              out = [
                  ...state,
                  action.hero
              ];
          }

          return out;
      }
      case HeroActionTypes.ADD_HEROES: {
          let out = [...state];

          action.heroes.forEach((hero) => {
              if (!isDuplicate(out, hero)) {
                  out.push(hero);
              }
          });

          return out;
      }
    default:
      return state;
  }
}
