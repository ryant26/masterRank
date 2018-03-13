import * as WalkthroughActionTypes from '../../actiontypes/walkthrough';

export const runWalkthrough = () => {
    return {
        type: WalkthroughActionTypes.RUN_WALKTHROUGH
    };
};

export const finishWalkthrough = () => {
    return {
        type: WalkthroughActionTypes.FINISH_WALKTHROUGH
    };
};