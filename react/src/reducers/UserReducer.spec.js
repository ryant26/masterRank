import UserReducer from '../reducers/UserReducer';
import * as UserActionTypes from '../actiontypes/user';

describe('User Reducer', () => {

  it('should handle UPDATE_USER by adding new user information', () => {
    let token = {battleNetId: 'PwNShoPP', region: 'us', platform: 'pc'};
    expect(UserReducer(undefined, {
      type: UserActionTypes.UPDATE_USER,
      user: token
    })).toEqual(token);
  });

});