import HeroFiltersReducer from './HeroFiltersReducer';
import * as actionTypes from 'actiontypes/heroFilters';
const heroNames = require('../../../shared/libs/allHeroNames').names;



describe('Hero Filters Reducer', () => {
    let initialState;

    beforeEach(() => {
        initialState = [];
    });

    it ('should have default initial state when passed undefined', () => {
        expect(HeroFiltersReducer(undefined, {})).toEqual(initialState);
    });

    describe('ADD_FILTER', () => {
        it ('should add an additional hero filter', () => {
          initialState = [heroNames[0]];
          expect(HeroFiltersReducer(initialState, {
              type: actionTypes.ADD_FILTER,
              heroName: heroNames[1]
          })).toEqual([heroNames[0], heroNames[1]]);
        });

        it ('should not add duplicates', () => {
          initialState = [heroNames[1]];
          expect(HeroFiltersReducer(initialState, {
              type: actionTypes.ADD_FILTER,
              heroName: heroNames[1]
          })).toEqual([heroNames[1]]);
        });
    });

    describe('REMOVE_FILTER', () => {
        it('should remove a filter from from the list', () => {
            initialState = [heroNames[1], heroNames[2], heroNames[3]];
            expect(HeroFiltersReducer(initialState, {
                type: actionTypes.REMOVE_FILTER,
                heroName: heroNames[2]
            })).toEqual([heroNames[1], heroNames[3]]);
        });

        it('should do nothing on an empty list', () => {
            expect(HeroFiltersReducer(initialState, {
                type: actionTypes.REMOVE_FILTER,
                heroName: heroNames[2]
            })).toEqual([]);
        });

        it('should do nothing if the list does not contain the filter', () => {
            initialState = [heroNames[2]];
            expect(HeroFiltersReducer(initialState, {
                type: actionTypes.REMOVE_FILTER,
                heroName: heroNames[0]
            })).toEqual([heroNames[2]]);
        });
    });

    describe('REMOVE_ALL_FILTERS', () => {
        it('should return an empty array no matter the current state', () => {
            initialState = [heroNames[1], heroNames[2], heroNames[3]];
            expect(HeroFiltersReducer(initialState, {
                type: actionTypes.REMOVE_ALL_FILTERS
            })).toEqual([]);
        });
    });
});