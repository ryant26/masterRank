import HeroReducer from './HeroReducer';
import HEROES from '../resources/heroes';
import * as HeroActionTypes from '../actiontypes/hero';

const initialState = {
    heroes: HEROES
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
            ]
        });
    });

});