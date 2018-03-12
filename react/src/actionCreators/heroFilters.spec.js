import * as heroFiltersActionType from 'actiontypes/heroFilters';
import * as HeroFilterActionCreators from 'actionCreators/heroFilters';

const tracerFilter = 'tracer';

describe('addFilter', () => {
  it ('should create the ADD_FILTER action', () => {
    expect(HeroFilterActionCreators.addFilter(tracerFilter))
      .toEqual({
        type: heroFiltersActionType.ADD_FILTER,
        heroName: tracerFilter
      });
  });
});

describe('removeFilter', () => {
    it ('should create the REMOVE_FILTER action', () => {
        expect(HeroFilterActionCreators.removeFilter(tracerFilter))
            .toEqual({
                type: heroFiltersActionType.REMOVE_FILTER,
                heroName: tracerFilter
            });
    });
});

describe('removeAllFilter', () => {
    it ('should create the REMOVE_FILTER action', () => {
        expect(HeroFilterActionCreators.removeAllFilters())
            .toEqual({
                type: heroFiltersActionType.REMOVE_ALL_FILTERS
            });
    });
});