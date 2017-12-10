import HeroReducer from './HeroReducer';
import * as HeroActionTypes from '../actiontypes/hero';

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
});