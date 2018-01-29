import * as PlatformActionTypes from '../actiontypes/platform';

export default function PlatformReducer(state=null, action) {
    switch(action.type) {
        case PlatformActionTypes.UPDATE_PLATFORM:
            return action.platform;
        default:
            return state;
    }
}