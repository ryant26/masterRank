import * as appActionsTypes from '../../actiontypes/app';
//import AppReducer from '../AppReducer';

export default function restStateOnLogout(reducerFunction) {
    return (state, action) => {
        switch(action.type) {
            case appActionsTypes.LOGOUT: {
                return reducerFunction(undefined, action);
            }
            default:
                return reducerFunction(state, action);
        }
//        return reducerFunction(AppReducer(state, action), action);
    }
};