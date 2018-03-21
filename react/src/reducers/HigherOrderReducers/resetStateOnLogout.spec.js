import resetStateOnLogout from 'reducers/HigherOrderReducers/resetStateOnLogout';
import * as appActionsTypes from 'actiontypes/app';


describe('resetStateOnLogout', () => {
    const mockReducer = jest.fn();
    const mockState = {};

    afterEach(() => {
        mockReducer.mockClear();
    });

    describe('when action is LOGOUT', () => {
        const logoutAction = { type: appActionsTypes.LOGOUT };

        beforeEach(() => {
            return resetStateOnLogout(mockReducer)(mockState, logoutAction);
        });

        it ('should called passed in reducer with and undefined state and logout action', () => {
            expect(mockReducer).toHaveBeenCalledWith(undefined, logoutAction);
        });
    });

    describe('when action is not LOGOUT', () => {
        const notLogoutAction = { type: 'NOT_LOGOUT_ACTION'};

        beforeEach(() => {
            return resetStateOnLogout(mockReducer)(mockState, notLogoutAction);
        });

        it ('should called passed in reducer with and passed state and logout action', () => {
            expect(mockReducer).toHaveBeenCalledWith(mockState, notLogoutAction);
        });
    });
});