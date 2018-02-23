import * as GroupActionTypes from '../actiontypes/group';

export const updateGroup = (updatedGroupData) => {
  return {
    type: GroupActionTypes.UPDATE_GROUP,
    updatedGroupData
  };
};

export const leaveGroup = () => {
  return {
    type: GroupActionTypes.LEAVE_GROUP,
  };
};