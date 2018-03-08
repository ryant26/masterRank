import * as actionsTypes from '../actiontypes/root';

export default function RootReducer(state, action) {
    switch (action.type) {
        case actionsTypes.LOGOUT: {
            return;
        }
        default:
            return state;
    }
}