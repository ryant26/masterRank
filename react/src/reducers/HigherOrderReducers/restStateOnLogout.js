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
        //TODO: discuss with Ryan, make sure we are on the same page
        //If we go with this way delete AppReducer, but keep appActionTypes
//        return reducerFunction(AppReducer(state, action), action);
    };
}