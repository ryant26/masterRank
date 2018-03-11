import * as PreferredHeroActionTypes from 'actiontypes/preferredHeroes';
import * as PreferredHeroActions from './preferredHeroes';

describe('addHero', () => {
  it ('should create the ADD_HERO action', () => {
    expect(PreferredHeroActions.addHero({name:"orisa", stat: "just doing my job"}, 1))
    .toEqual({
      type: PreferredHeroActionTypes.ADD_HERO,
      hero: {name:"orisa", stat: "just doing my job"},
      preference: 1
    });
  });
});

describe('removeHero', () => {
    it ('should create the REMOVE_HERO action', () => {
        expect(PreferredHeroActions.removeHero({name:"orisa", stat: "just doing my job"}, 1))
            .toEqual({
                type: PreferredHeroActionTypes.REMOVE_HERO,
                hero: {name:"orisa", stat: "just doing my job"},
                preference: 1
            });
    });
});

describe('updateHeroes', () => {
    it ('should create the UPDATE_HEROES action', () => {
        expect(PreferredHeroActions.updateHeroes([{name:"orisa", stat: "just doing my job"}]))
            .toEqual({
                type: PreferredHeroActionTypes.UPDATE_HEROES,
                heroes: [{name:"orisa", stat: "just doing my job"}]
            });
    });
});