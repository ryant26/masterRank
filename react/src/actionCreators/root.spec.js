import * as RootActionTypes from '../actiontypes/root';
import * as RootActions from './root';

describe('Logout', () => {

    it ('should create the LOGOUT action', () => {
        expect(RootActions.logout())
            .toEqual({
                type: RootActionTypes.LOGOUT
            });
    });
});