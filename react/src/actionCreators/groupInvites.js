import * as GroupInviteActionTypes from 'actiontypes/groupInvites';

export const addGroupInvite = (invite) => {
  return {
    type: GroupInviteActionTypes.ADD_GROUP_INVITE,
    invite
  };
};

export const removeGroupInvite = (invite) => {
  return {
    type: GroupInviteActionTypes.REMOVE_GROUP_INVITE,
    invite
  };
};