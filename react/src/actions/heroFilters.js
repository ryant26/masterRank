import * as HeroFilterActionTypes from '../actiontypes/heroFilters';

export const addFilter = (heroName) => {
  return {
    type: HeroFilterActionTypes.ADD_FILTER,
    heroName
  };
};

export const removeFilter = (heroName) => {
    return {
        type: HeroFilterActionTypes.REMOVE_FILTER,
        heroName
    };
};