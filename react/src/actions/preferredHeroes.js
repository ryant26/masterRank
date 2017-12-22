import * as PreferredHeroActionsTypes from '../actiontypes/preferredHeroes';

export const addHero = (hero, preference) => {
  return {
    type: PreferredHeroActionsTypes.ADD_HERO,
    hero,
    preference
  };
};

export const setSelectedSlot = (slot) => {
    return {
        type: PreferredHeroActionsTypes.SET_SELECTED_SLOT,
        slot
    };
};