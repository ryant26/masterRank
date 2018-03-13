import * as actionsTypes from '../../actiontypes/walkthrough';

const initialState = { state: 'run' };

export default function WalkthroughReducer(state=initialState, action) {
    switch (action.type) {
        case actionsTypes.FINISH_WALKTHROUGH: {
            return { state: 'finished' };
        }
        default:
            return state;
    }
}