import * as HeroActionTypes from '../actiontypes/hero';

import HEROES from '../resources/heroes';

const initialState = {
  heroes: HEROES
};

export default function HeroReducer(state=initialState, action) {

  switch(action.type) {

    case HeroActionTypes.ADD_HERO:
      return {
        heroes: [
          ...state.heroes,
          {
            hero: {}
          }
        ]
      };

    default:
      return state;
  }
}
