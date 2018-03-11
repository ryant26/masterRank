import PreferredHeroesReducer from './PreferredHeroesReducer';
import * as PreferredHeroActionTypes from 'actiontypes/preferredHeroes';
import Heroes from 'resources/heroes';

const initialState = {heroes: []};

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
        heroes: ['orisa']
    }
    );
  });

    it('should handle UPDATE_HEROES by replacing the current state with the new state', () => {
        let updatedArray = [Heroes[2], Heroes[3]];
        expect(PreferredHeroesReducer([Heroes[0], Heroes[1]], {
            type: PreferredHeroActionTypes.UPDATE_HEROES,
            heroes: updatedArray
        })).toEqual({
                heroes: updatedArray
            }
        );
    });

    it('should handle REMOVE_HERO by removing the hero with the same name and preference number', () => {
        expect(PreferredHeroesReducer({heroes: [Heroes[0], Heroes[1]]}, {
            type: PreferredHeroActionTypes.REMOVE_HERO,
            hero: Heroes[0],
            preference: Heroes[0].priority
        })).toEqual({
                heroes: [Heroes[1]]
            }
        );
    });

    it('should handle REMOVE_HERO by not removing a hero with the wrong preference number', () => {
        expect(PreferredHeroesReducer({heroes: [Heroes[0], Heroes[1]]}, {
            type: PreferredHeroActionTypes.REMOVE_HERO,
            hero: Heroes[0],
            preference: 2
        })).toEqual({
                heroes: [Heroes[0], Heroes[1]]
            }
        );
    });

    it('should handle REMOVE_HERO by removing the hero based on name when no preference number is sent', () => {
        expect(PreferredHeroesReducer({heroes: [Heroes[0], Heroes[1]]}, {
            type: PreferredHeroActionTypes.REMOVE_HERO,
            hero: Heroes[0]
        })).toEqual({
                heroes: [Heroes[1]]
            }
        );
    });

});