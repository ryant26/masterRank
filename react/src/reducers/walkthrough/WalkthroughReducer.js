import * as actionsTypes from '../../actiontypes/walkthrough';

const initialState = {
    finished: {}
};

export default function WalkthroughReducer(state=initialState, action) {
    switch (action.type) {
        case actionsTypes.START_WALKTHROUGH: {
            let outState = { ...state };
            delete outState.finished[action.platformDisplayName];
            return outState;
        }
        case actionsTypes.FINISH_WALKTHROUGH: {
            let outState = { ...state };
            outState.finished[action.platformDisplayName] = true;
            return outState;
        }
        default:
            return state;
    }
}