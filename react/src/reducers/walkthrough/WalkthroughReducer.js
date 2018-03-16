import * as actionsTypes from '../../actiontypes/walkthrough';

const initialState = {
    finished: {}
};

export default function WalkthroughReducer(state=initialState, action) {
    switch (action.type) {
        case actionsTypes.START_WALKTHROUGH: {
            let finished = state.finished;
            delete finished[action.platformDisplayName];
            return {
                finished
            };
        }
        case actionsTypes.FINISH_WALKTHROUGH: {
            let finished = state.finished;
            finished[action.platformDisplayName] = true;
            return {
                finished
            };
        }
        default:
            return state;
    }
}