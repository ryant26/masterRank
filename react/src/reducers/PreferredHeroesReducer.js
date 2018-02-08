import * as PreferredHeroActionTypes from '../actiontypes/preferredHeroes';

const initialState = {
    heroes: [],
};

const copyState = (oldState) => {
    return {
        heroes: [...oldState.heroes],
    };
};

export default function PreferredHeroesReducer(state=initialState, action) {
  switch(action.type) {
    case PreferredHeroActionTypes.ADD_HERO:
        if (!state.heroes.includes(action.hero)) {
            let newState = copyState(state);
            newState.heroes.splice(action.preference - 1, 1, action.hero);

            return newState;
        }
        return state;
      case PreferredHeroActionTypes.REMOVE_HERO: {
          let index = state.heroes.indexOf(action.hero);
          let preference = action.preference;

          if (typeof preference !== 'number' || index === preference - 1) {
              let newState = copyState(state);
              newState.heroes.splice(index, 1);

              return newState;
          }
          return state;
      }
      case PreferredHeroActionTypes.UPDATE_HEROES: {
          return {
              heroes: [...action.heroes]
          };
      }
    default:
      return state;
  }
}