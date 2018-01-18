import * as HeroActionTypes from '../actiontypes/hero';
import {arrayHasDuplicate} from "./reducerUtilities";

export default function HeroReducer(state=[], action) {
  switch(action.type) {
      case HeroActionTypes.ADD_HERO: {
          let out = state;
          if (!arrayHasDuplicate(out, action.hero, 'platformDisplayName', 'heroName')) {
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
              if (!arrayHasDuplicate(out, hero, 'platformDisplayName', 'heroName')) {
                  out.push(hero);
              }
          });

          return out;
      }
    default:
      return state;
  }
}
