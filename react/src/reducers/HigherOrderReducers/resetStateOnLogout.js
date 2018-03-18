import * as appActionsTypes from 'actiontypes/app';

export default function resetStateOnLogout(reducerFunction) {
    return (state, action) => {
        switch(action.type) {
            case appActionsTypes.LOGOUT: {
                return reducerFunction(undefined, action);
            }
            default:
                return reducerFunction(state, action);
        }
    };
}