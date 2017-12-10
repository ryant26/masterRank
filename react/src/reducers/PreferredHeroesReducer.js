import * as PreferredHeroActionTypes from '../actiontypes/preferredHeroes';
import {arrayHasDuplicate} from "./reducerUtilities";


export default function PreferredHeroesReducer(state=[], action) {
  switch(action.type) {
    case PreferredHeroActionTypes.ADD_HERO:
        if (!arrayHasDuplicate(state, action.hero, 'battleNetId', 'heroName')) {
            return [
                ...state,
                action.hero
            ];
        }
        return state;
    default:
      return state;
  }
}