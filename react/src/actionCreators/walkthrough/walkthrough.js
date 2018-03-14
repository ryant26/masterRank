import * as WalkthroughActionTypes from '../../actiontypes/walkthrough';

export const finishWalkthrough = ( platformDisplayName ) => {
    return {
        type: WalkthroughActionTypes.FINISH_WALKTHROUGH,
        platformDisplayName
    };
};