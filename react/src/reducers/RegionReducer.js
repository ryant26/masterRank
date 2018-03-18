import * as RegionActionTypes from 'actiontypes/region';

export default function RegionReducer(state=null, action) {
    switch(action.type) {
        case RegionActionTypes.UPDATE_REGION:
            return action.region;
        default:
            return state;
    }
}