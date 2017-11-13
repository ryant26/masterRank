import * as HeroActionTypes from '../actiontypes/hero';
import * as HeroActionCreators from './hero';

describe('addHero', () => {
    it ('should create the ADD_HERO action', () => {
        expect(HeroActionCreators.addHero({name:"orisa", stat: "just doing my job"}))
        .toEqual({
            type: HeroActionTypes.ADD_HERO,
            hero: {name:"orisa", stat: "just doing my job"}
        });
    });
});