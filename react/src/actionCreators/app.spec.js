import * as AppActionTypes from '../actiontypes/app';
import * as AppActions from './app';

describe('Logout', () => {

    it ('should create the LOGOUT action', () => {
        expect(AppActions.logout())
            .toEqual({
                type: AppActionTypes.LOGOUT
            });
    });
});