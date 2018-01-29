import * as PlatformActionTypes from '../actiontypes/platform';

export const updatePlatform = (platform) => {
    return {
        type: PlatformActionTypes.UPDATE_PLATFORM,
        platform
    };
};
