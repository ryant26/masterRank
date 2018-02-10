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
      let inviteIndex = state.findIndex((invite) => {
        return invite.heroName === action.invite.heroName
          && invite.platformDisplayName === invite.hero.platformDisplayName;
      });

      if (inviteIndex >= 0) {
        let out = [...state];
        out.splice(inviteIndex, 1);
        return out;
      }

      return state;
    }


    default:
      return state;
  }
}