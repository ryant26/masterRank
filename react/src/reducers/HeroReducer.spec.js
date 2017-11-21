import HeroReducer from './HeroReducer';
import HEROES from '../resources/heroes';
import * as HeroActionTypes from '../actiontypes/hero';

const initialState = {
    heroes: HEROES,
    preferredHeroes: [HEROES[0]]
};

describe('Hero Reducer', () => {
    it ('should have default initial state when passed undefined', () => {
        expect(HeroReducer(undefined, {})).toEqual(initialState);
    });

    it ('should handle ADD_HERO by adding an additional hero', () => {
        expect(HeroReducer(initialState, {
            type: HeroActionTypes.ADD_HERO,
            hero: {name:"orisa", stat: "just doing my job"}
        })).toEqual({
            heroes: [
                ...initialState.heroes,
                { name:"orisa", stat: "just doing my job" }
            ],
            preferredHeroes: [HEROES[0]]
        });
    });

    it('should handle ADD_PREFERRED_HERO by adding an additional hero to the preferredHeroes Array', () => {
      expect(HeroReducer(initialState, {
        type: HeroActionTypes.ADD_PREFERRED_HERO,
        hero: {name:"orisa", stat: "just doing my job"}
      })).toEqual({
        heroes: HEROES,
        preferredHeroes: [
          ...initialState.preferredHeroes,
          { name:"orisa", stat: "just doing my job" }
        ]
      });
    });

});