import * as PreferredHeroActionsTypes from '../actiontypes/preferredHeroes';

export const addHero = (hero) => {
  return {
    type: PreferredHeroActionsTypes.ADD_HERO,
    hero
  };
};
