import RootReducer from '../reducers/RootReducer';
import * as RootActionTypes from '../actiontypes/root';

describe('Root Reducer', () => {

    it('should handle LOGOUT by returning undefined', () => {
        expect(RootReducer({}, {
            type: RootActionTypes.LOGOUT
        })).toEqual(undefined);
    });
});