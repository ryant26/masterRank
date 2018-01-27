import * as actionsTypes from '../actiontypes/groupInvites';
import {arrayHasDuplicate} from "./reducerUtilities";
import groupInvites from '../resources/groupInvites';

export default function GroupInvitesReducer(state=groupInvites, action) {
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