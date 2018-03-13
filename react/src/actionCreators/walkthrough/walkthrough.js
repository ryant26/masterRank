import * as WalkthroughActionTypes from '../../actiontypes/walkthrough';

export const finishWalkthrough = () => {
    return {
        type: WalkthroughActionTypes.FINISH_WALKTHROUGH
    };
};