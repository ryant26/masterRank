import * as HeroFilterActionTypes from 'actiontypes/heroFilters';

export const addFilter = (heroName) => {
  return {
    type: HeroFilterActionTypes.ADD_FILTER,
    heroName,
    label: heroName
  };
};

export const removeFilter = (heroName) => {
    return {
        type: HeroFilterActionTypes.REMOVE_FILTER,
        heroName,
        label: heroName
    };
};

export const removeAllFilters = () => {
    return {
        type: HeroFilterActionTypes.REMOVE_ALL_FILTERS,
        label: 'REMOVE_ALL_FILTERS'
    };
};