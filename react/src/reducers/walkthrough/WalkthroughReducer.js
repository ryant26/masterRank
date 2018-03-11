import * as actionsTypes from '../../actiontypes/walkthrough';

export default function WalkthroughReducer(state=false, action) {
    switch (action.type) {
        case actionsTypes.TOGGLE_WALKTHROUGH: {
            return !state;
        }
        default:
            return state;
    }
}