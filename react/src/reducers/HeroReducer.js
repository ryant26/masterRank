import * as HeroActionTypes from '../actiontypes/hero';
import {arrayHasDuplicate} from "./reducerUtilities";
import MockHeroes from '../resources/heroes';
const names = require('../../../shared/allHeroNames').names;

let initialState = [];

const getRandomHeroName = function() {
    let randNum = Math.floor(Math.random() * names.length);
    return names[randNum];
};

for (let i = 0; i < 300; i++) {
    let hero = Object.assign({}, MockHeroes[0]);
    hero.heroName = getRandomHeroName();
    initialState.push(hero);
}

export default function HeroReducer(state=initialState, action) {
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
