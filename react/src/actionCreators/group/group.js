import * as GroupActionTypes from 'actiontypes/group';

export const updateGroup = (updatedGroupData) => {
  return {
    type: GroupActionTypes.UPDATE_GROUP,
    updatedGroupData
  };
};

export const initializeGroup = () => {
  return {
    type: GroupActionTypes.INITIALIZE_GROUP,
  };
};