import * as HeroActionTypes from 'actiontypes/hero';
import {arrayHasDuplicate} from "reducers/reducerUtilities";

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
      case HeroActionTypes.REMOVE_HERO: {
          let heroIndex = state.findIndex((hero) => {
              return hero.heroName === action.hero.heroName &&
                  hero.platformDisplayName === action.hero.platformDisplayName;
          });

          if (heroIndex >= 0) {
              let out = [...state];
              out.splice(heroIndex, 1);
              return out;
          }

          return state;
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
      case HeroActionTypes.CLEAR_ALL_HEROES: {
          return [];
      }
    default:
      return state;
  }
}
