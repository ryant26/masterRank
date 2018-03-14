import * as actionsTypes from '../../actiontypes/walkthrough';

const initialState = {
    finished: {}
};

export default function WalkthroughReducer(state=initialState, action) {
    switch (action.type) {
        case actionsTypes.FINISH_WALKTHROUGH: {
            state.finished[action.platformDisplayName] = true;
            return state;
        }
        default:
            return state;
    }
}