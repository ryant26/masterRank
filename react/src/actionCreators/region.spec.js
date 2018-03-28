import * as RegionActionTypes from 'actiontypes/region';
import * as RegionActions from 'actionCreators/region';

describe('Update Region', () => {

    it ('should create the UPDATE_REGION action', () => {
        expect(RegionActions.updateRegion('us'))
            .toEqual({
                type: RegionActionTypes.UPDATE_REGION,
                label: 'us'
            });
    });
});