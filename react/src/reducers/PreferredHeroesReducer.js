import * as PreferredHeroActionTypes from '../actiontypes/preferredHeroes';
import HEROES from '../resources/heroes';

const initialState = [HEROES[0]];


export default function PreferredHeroesReducer(state=initialState, action) {
  switch(action.type) {
    case PreferredHeroActionTypes.ADD_HERO:
      return [
          ...state,
          action.hero
        ];
    default:
      return state;
  }
}