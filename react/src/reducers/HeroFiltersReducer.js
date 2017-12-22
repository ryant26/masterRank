import * as actionsTypes from '../actiontypes/heroFilters';

export default function HeroFiltersReducer(state=[], action) {
  switch (action.type) {
    case actionsTypes.ADD_FILTER:
      if (!state.includes(action.heroName)) {
          return [...state, action.heroName];
      }
      return state;
    case actionsTypes.REMOVE_FILTER:
      if (state.includes(action.heroName)) {
          let newState = [...state];
          newState.splice(newState.indexOf(action.heroName), 1);
          return newState;
      }
      return state;
    default:
      return state;
  }
}
