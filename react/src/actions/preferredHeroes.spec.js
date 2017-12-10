import * as PreferredHeroActionTypes from '../actiontypes/preferredHeroes';
import * as PreferredHeroActions from './preferredHeroes';

describe('addHero', () => {
  it ('should create the ADD_HERO action', () => {
    expect(PreferredHeroActions.addHero({name:"orisa", stat: "just doing my job"}))
    .toEqual({
      type: PreferredHeroActionTypes.ADD_HERO,
      hero: {name:"orisa", stat: "just doing my job"}
    });
  });
});