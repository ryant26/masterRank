import PlatformReducer from '../reducers/PlatformReducer';
import * as PlatformActionTypes from '../actiontypes/platform';

describe('Platform Reducer', () => {

    it('should handle UPDATE_PLATFORM by adding platform information', () => {
        let platform = 'pc';
        expect(PlatformReducer(undefined, {
            type: PlatformActionTypes.UPDATE_PLATFORM,
            platform: platform,
        })).toEqual(platform);
    });
});