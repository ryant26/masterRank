import * as HeroActionTypes from '../actiontypes/hero';

export const addHero = (hero) => {
  return {
    type: HeroActionTypes.ADD_HERO,
    hero
  }
}
