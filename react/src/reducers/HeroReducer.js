import * as HeroActionTypes from '../actiontypes/hero';
import HEROES from '../resources/heroes';

const initialState = {
  heroes: HEROES,
  preferredHeroes: [HEROES[0]]
};


export default function HeroReducer(state=initialState, action) {
  switch(action.type) {
    case HeroActionTypes.ADD_HERO:
      return Object.assign({}, state, {
        heroes: [
          ...state.heroes,
          action.hero
        ]
      });
    case HeroActionTypes.ADD_PREFERRED_HERO:
      return Object.assign({}, state, {
        preferredHeroes: [
          ...state.preferredHeroes,
          action.hero
        ]
      });
    default:
      return state;
  }
}
