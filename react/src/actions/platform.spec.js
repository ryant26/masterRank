import * as PlatformActionTypes from '../actiontypes/platform';
import * as PlatformActions from './platform';

describe('Update Platform', () => {

    it ('should create the UPDATE_Platform action', () => {
        expect(PlatformActions.updatePlatform('pc'))
            .toEqual({
                type: PlatformActionTypes.UPDATE_PLATFORM,
                platform: 'pc'
            });
    });
});