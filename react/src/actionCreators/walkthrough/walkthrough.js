import * as WalkthroughActionTypes from 'actiontypes/walkthrough';

export const startWalkthrough = ( platformDisplayName ) => {
    return {
        type: WalkthroughActionTypes.START_WALKTHROUGH,
        platformDisplayName,
        label: platformDisplayName
    };
};

export const finishWalkthrough = ( platformDisplayName ) => {
    return {
        type: WalkthroughActionTypes.FINISH_WALKTHROUGH,
        platformDisplayName,
        label: platformDisplayName
    };
};