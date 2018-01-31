import RegionReducer from '../reducers/RegionReducer';
import * as RegionActionTypes from '../actiontypes/region';

describe('Platform Reducer', () => {

    it('should handle UPDATE_REGION by adding platform information', () => {
        let region = 'us';
        expect(RegionReducer(undefined, {
            type: RegionActionTypes.UPDATE_REGION,
            region: region,
        })).toEqual(region);
    });
});