import HeroReducer from 'reducers/HeroReducer';
import Heroes from 'resources/heroes';
import * as HeroActionTypes from 'actiontypes/hero';

const initialState = [];

const getHero = (platformDisplayName = 'PwNSHoPP', heroName='Orisa', priority = 1) => {
    return {
        platformDisplayName,
        heroName,
        priority
    };
};

describe('Hero Reducer', () => {
    it ('should have default initial state when passed undefined', () => {
        expect(HeroReducer(undefined, {})).toEqual(initialState);
    });

    describe('ADD_HERO', () => {
        it ('should add an additional hero', () => {
            let hero = getHero();
            expect(HeroReducer(initialState, {
                type: HeroActionTypes.ADD_HERO,
                hero
            })).toEqual([
                ...initialState,
                hero
            ]);
        });

        it ('should not allow duplicates based on 3 hero properties: platformDisplayName, heroName, priority', () => {
            let hero = getHero();
            let duplicateHero = getHero();

            let stateAfterDuplicateHero = HeroReducer([hero], {
                type: HeroActionTypes.ADD_HERO,
                hero: duplicateHero
            });

            expect(stateAfterDuplicateHero).toEqual([hero]);
        });

        it ('should allow duplicate platformDisplayName/heroName combinations with different priority', () => {
            let hero = getHero();
            let sameHeroDifferentPriority = getHero();
            sameHeroDifferentPriority.priority = 2;

            let stateAfterSecondHero = HeroReducer([hero], {
                type: HeroActionTypes.ADD_HERO,
                hero: sameHeroDifferentPriority
            });

            expect(stateAfterSecondHero).toHaveLength(2);

            expect(stateAfterSecondHero).toEqual([
                hero,
                sameHeroDifferentPriority
            ]);
        });

        it ('should allow duplicate priority/heroName combinations with different platformDisplayName', () => {
            let hero = getHero();
            let sameHeroDifferentPlatformDisplayName = getHero();
            sameHeroDifferentPlatformDisplayName.platformDisplayName = 'notTheSame';

            let stateAfterSecondHero = HeroReducer([hero], {
                type: HeroActionTypes.ADD_HERO,
                hero: sameHeroDifferentPlatformDisplayName
            });

            expect(stateAfterSecondHero).toHaveLength(2);

            expect(stateAfterSecondHero).toEqual([
                hero,
                sameHeroDifferentPlatformDisplayName
            ]);
        });

        it ('should allow duplicate priority/platformDisplayName combinations with different heroName', () => {
            let hero = getHero();
            let sameHeroDifferentHeroName = getHero();
            sameHeroDifferentHeroName.heroName = 'notTheSame';

            let stateAfterSecondHero = HeroReducer([hero], {
                type: HeroActionTypes.ADD_HERO,
                hero: sameHeroDifferentHeroName
            });

            expect(stateAfterSecondHero).toHaveLength(2);

            expect(stateAfterSecondHero).toEqual([
                hero,
                sameHeroDifferentHeroName
            ]);
        });
    });

    describe('REMOVE_HERO', () => {
        it ('should remove the hero based on 3 criteria: platformDisplayName, heroName, priority', () => {
            let hero = getHero();
            expect(HeroReducer([hero, Heroes[1], Heroes[2]], {
                type: HeroActionTypes.REMOVE_HERO,
                hero
            })).toEqual([
                Heroes[1], Heroes[2]
            ]);
        });

        it ('should not remove the hero if priority is different', () => {
            let hero = getHero();
            let differentPriorityHero = getHero();
            differentPriorityHero.priority = 2;

            expect(HeroReducer([hero, Heroes[1], Heroes[2]], {
                type: HeroActionTypes.REMOVE_HERO,
                hero: differentPriorityHero
            })).toEqual([
                hero, Heroes[1], Heroes[2]
            ]);
        });

        it ('should not remove the hero if heroName is different', () => {
            let hero = getHero();
            let differentHeroName = getHero();
            differentHeroName.heroName = 'NotAHero';

            expect(HeroReducer([hero, Heroes[1], Heroes[2]], {
                type: HeroActionTypes.REMOVE_HERO,
                hero: differentHeroName
            })).toEqual([
                hero, Heroes[1], Heroes[2]
            ]);
        });

        it ('should not remove the hero if platformDisplayName is different', () => {
            let hero = getHero();
            let differentPlatoformDisplayName = getHero();
            differentPlatoformDisplayName.platformDisplayName = 'NotThePlatformDisplayName';

            expect(HeroReducer([hero, Heroes[1], Heroes[2]], {
                type: HeroActionTypes.REMOVE_HERO,
                hero: differentPlatoformDisplayName
            })).toEqual([
                hero, Heroes[1], Heroes[2]
            ]);
        });
    });

    describe('CLEAR_ALL', () => {
        it ('should set state to []', () => {
            expect(HeroReducer([Heroes[1], Heroes[2]], {
                type: HeroActionTypes.CLEAR_ALL_HEROES,
            })).toEqual([]);
        });
    });
});