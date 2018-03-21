import * as PreferredHeroActionsTypes from 'actiontypes/preferredHeroes';

export const addHero = (hero, preference) => {
  return {
    type: PreferredHeroActionsTypes.ADD_HERO,
    hero,
    preference
  };
};

export const removeHero = (hero, preference) => {
    return {
        type: PreferredHeroActionsTypes.REMOVE_HERO,
        hero,
        preference
    };
};

export const updateHeroes = (heroes) => {
    return {
        type: PreferredHeroActionsTypes.UPDATE_HEROES,
        heroes
    };
};