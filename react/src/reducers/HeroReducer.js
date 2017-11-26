import * as HeroActionTypes from '../actiontypes/hero';
import HEROES from '../resources/heroes';

const initialState = [...HEROES];


export default function HeroReducer(state=initialState, action) {
  switch(action.type) {
    case HeroActionTypes.ADD_HERO:
      return [
        ...state,
        action.hero
      ];
    default:
      return state;
  }
}
