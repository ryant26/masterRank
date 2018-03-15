import HeroReducer from 'reducers/HeroReducer';
import Heroes from 'resources/heroes';
import * as HeroActionTypes from 'actiontypes/hero';

const initialState = [];

describe('Hero Reducer', () => {
    it ('should have default initial state when passed undefined', () => {
        expect(HeroReducer(undefined, {})).toEqual(initialState);
    });

    it ('should handle ADD_HERO by adding an additional hero', () => {
        expect(HeroReducer(initialState, {
            type: HeroActionTypes.ADD_HERO,
            hero: {name:"orisa", stat: "just doing my job"}
        })).toEqual([
          ...initialState,
          { name:"orisa", stat: "just doing my job" }
        ]);
    });

    it ('should handle REMOVE_HERO by removing the hero', () => {
        let hero = {heroName:"orisa", platformDisplayName: "myName"};
        expect(HeroReducer([hero, Heroes[1], Heroes[2]], {
            type: HeroActionTypes.REMOVE_HERO,
            hero
        })).toEqual([
            Heroes[1], Heroes[2]
        ]);
    });

    it ('should handle CLEAR_ALL_HEROES by setting state to []', () => {
        expect(HeroReducer([Heroes[1], Heroes[2]], {
            type: HeroActionTypes.CLEAR_ALL_HEROES,
        })).toEqual([]);
    });
});