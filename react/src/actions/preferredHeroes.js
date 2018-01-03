import * as PreferredHeroActionsTypes from '../actiontypes/preferredHeroes';

export const addHero = (hero, preference) => {
  return {
    type: PreferredHeroActionsTypes.ADD_HERO,
    hero,
    preference
  };
};

export const removeHero = (hero) => {
    return {
        type: PreferredHeroActionsTypes.REMOVE_HERO,
        hero
    };
};

export const setSelectedSlot = (slot) => {
    return {
        type: PreferredHeroActionsTypes.SET_SELECTED_SLOT,
        slot
    };
};