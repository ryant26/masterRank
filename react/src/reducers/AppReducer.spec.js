import AppReducer from './AppReducer';
import * as AppActionTypes from '../actiontypes/app';

describe('App Reducer', () => {

    it('should handle LOGOUT by returning undefined', () => {
        expect(AppReducer({}, {
            type: AppActionTypes.LOGOUT
        })).toEqual(undefined);
    });
});