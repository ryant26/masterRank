import * as WalkthroughActionTypes from '../../actiontypes/walkthrough';

export const runWalkthrough = () => {
    return {
        type: WalkthroughActionTypes.RUN_WALKTHROUGH
    };
};

export const finishedWalkthrough = () => {
    return {
        type: WalkthroughActionTypes.FINISHED_WALKTHROUGH
    };
};