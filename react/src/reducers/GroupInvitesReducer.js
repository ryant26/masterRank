import * as actionsTypes from '../actiontypes/groupInvites';
import {arrayHasDuplicate} from "./reducerUtilities";

export default function GroupInvitesReducer(state=[], action) {
  switch (action.type) {

    case actionsTypes.ADD_GROUP_INVITE: {
      if (!arrayHasDuplicate(state, action.invite, 'id')) {
          return [...state, action.invite];
      }
      return state;
    }
    case actionsTypes.REMOVE_GROUP_INVITE: {
        let groupInviteIndex = state.findIndex((groupInvite) => {
            return groupInvite.groupId === action.invite.groupId;
        });

        if (groupInviteIndex >= 0) {
            let nextState = [...state];
            nextState.splice(groupInviteIndex, 1);
            return nextState;
        }

        return state;
    }
    default:
      return state;
  }
}