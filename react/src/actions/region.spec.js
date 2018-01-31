import * as RegionActionTypes from '../actiontypes/region';
import * as RegionActions from './region';

describe('Update Region', () => {

    it ('should create the UPDATE_REGION action', () => {
        expect(RegionActions.updateRegion('us'))
            .toEqual({
                type: RegionActionTypes.UPDATE_REGION,
                region: 'us'
            });
    });
});