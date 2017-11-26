import * as actionsTypes from '../actiontypes/groupInvites';
import groupInvites from '../resources/groupInvites';

const initialState = [...groupInvites];

export default function GroupInvitesReducer(state=initialState, action) {
  switch (action.type) {
    case actionsTypes.ADD_GROUP_INVITE:
      return [...state, action.invite];
    default:
      return state;
  }
}