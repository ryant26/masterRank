import * as actionsTypes from '../actiontypes/groupInvites';
import {arrayHasDuplicate} from "./reducerUtilities";

export default function GroupInvitesReducer(state=[], action) {
  switch (action.type) {
    case actionsTypes.ADD_GROUP_INVITE:
      if (!arrayHasDuplicate(state, action.invite, 'id')) {
          return [...state, action.invite];
      }
      return state;
    default:
      return state;
  }
}