import * as RegionActionTypes from 'actiontypes/region';

export const updateRegion = (region) => {
    return {
        type: RegionActionTypes.UPDATE_REGION,
        label: region
    };
};
