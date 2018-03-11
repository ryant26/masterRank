import * as actionsTypes from 'actiontypes/app';

export default function AppReducer(state, action) {
    switch (action.type) {
        case actionsTypes.LOGOUT: {
            return;
        }
        default:
            return state;
    }
}