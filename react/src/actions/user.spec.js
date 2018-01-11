import * as UserActionTypes from '../actiontypes/user';
import * as UserActions from './user';

describe('Update User', () => {
    it ('should create the UPDATE_USER action', () => {
        expect(UserActions.updateUser({platformDisplayName:'testUser#1234', region: 'us', platform: 'pc'}))
            .toEqual({
                type: UserActionTypes.UPDATE_USER,
                user: {platformDisplayName:'testUser#1234', region: 'us', platform: 'pc'}
            });
    });
});