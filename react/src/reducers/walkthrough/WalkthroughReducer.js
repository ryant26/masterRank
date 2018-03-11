import * as actionsTypes from '../../actiontypes/walkthrough';

export default function WalkthroughReducer(state='', action) {
    switch (action.type) {
        case actionsTypes.RUN_WALKTHROUGH: {
            if(state === 'finished') {
                return state;
            }
            return 'run';
        }
        case actionsTypes.FINISHED_WALKTHROUGH: {
            return 'finished';
        }
        default:
            return state;
    }
}