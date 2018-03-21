import * as AppActionTypes from 'actiontypes/app';
import * as AppActions from 'actionCreators/app';

describe('Logout', () => {

    it ('should create the LOGOUT action', () => {
        expect(AppActions.logout())
            .toEqual({
                type: AppActionTypes.LOGOUT
            });
    });
});