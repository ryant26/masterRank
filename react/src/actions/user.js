import * as UserActionTypes from '../actiontypes/user';

export const updateUser = (user) => {
    return {
        type: UserActionTypes.UPDATE_USER,
        user
    };
};
