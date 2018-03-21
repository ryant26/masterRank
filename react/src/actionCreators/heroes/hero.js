import * as HeroActionTypes from 'actiontypes/hero';

export const addHero = (hero) => {
  return {
    type: HeroActionTypes.ADD_HERO,
    hero
  };
};

export const removeHero = (hero) => {
    return {
        type: HeroActionTypes.REMOVE_HERO,
        hero
    };
};

export const addHeroes = (heroes) => {
  return {
    type: HeroActionTypes.ADD_HEROES,
      heroes
  };
};

export const clearAllHeroes = () => {
  return {
    type: HeroActionTypes.CLEAR_ALL_HEROES
  };
};