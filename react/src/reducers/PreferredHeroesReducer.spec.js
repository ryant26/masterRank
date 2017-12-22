import PreferredHeroesReducer from './PreferredHeroesReducer';
import * as PreferredHeroActionTypes from '../actiontypes/preferredHeroes';

const initialState = {heroes: [], selectedSlot: 1};

describe('Preferred Hero Reducer', () => {
  it ('should have default initial state when passed undefined', () => {
    expect(PreferredHeroesReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle ADD_PREFERRED_HERO by adding an additional hero to the preferredHeroes Array', () => {
    expect(PreferredHeroesReducer(initialState, {
      type: PreferredHeroActionTypes.ADD_HERO,
      hero: 'orisa',
      preference: 1
    })).toEqual({
        heroes: ['orisa'],
        selectedSlot: 2
    }
    );
  });

});