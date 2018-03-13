import * as actionsTypes from '../../actiontypes/walkthrough';

export default function WalkthroughReducer(state={}, action) {
    switch (action.type) {
        case actionsTypes.RUN_WALKTHROUGH: {
            if(state.state === 'finished') {
                return state;
            }
            return { state: 'run' };
        }
        case actionsTypes.FINISH_WALKTHROUGH: {
            return { state: 'finished' };
        }
        default:
            return state;
    }
}