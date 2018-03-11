import * as UserActionTypes from 'actiontypes/user';

export default function UserReducer(state=null, action) {
    switch(action.type) {
        case UserActionTypes.UPDATE_USER:
            return action.user;
        default:
            return state;
    }
}