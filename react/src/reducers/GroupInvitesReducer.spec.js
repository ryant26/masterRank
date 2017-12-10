import GroupInvitesReducer from './GroupInvitesReducer';
import Invites from '../resources/groupInvites';
import * as actionTypes from '../actiontypes/groupInvites';

const initialState = [];

describe('Group Invite Reducer', () => {
  it ('should have default initial state when passed undefined', () => {
    expect(GroupInvitesReducer(undefined, {})).toEqual(initialState);
  });

  it ('should handle ADD_GROUP_INVITE by adding an additional invite', () => {
    expect(GroupInvitesReducer(initialState, {
      type: actionTypes.ADD_GROUP_INVITE,
      invite: Invites[0]
    })).toEqual([
      ...initialState,
      Invites[0]
    ]);
  });
});