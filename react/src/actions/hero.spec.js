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

describe('addHeroes', () => {
    it ('should create the ADD_HEROES action', () => {
        expect(HeroActionCreators.addHeroes([{name:"orisa", stat: "just doing my job"}]))
            .toEqual({
                type: HeroActionTypes.ADD_HEROES,
                heroes: [{name:"orisa", stat: "just doing my job"}]
            });
    });
});