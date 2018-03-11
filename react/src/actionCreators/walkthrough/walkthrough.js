import * as WalkthroughActionTypes from '../../actiontypes/walkthrough';

export const toggleWalkthrough = () => {
    return {
        type: WalkthroughActionTypes.TOGGLE_WALKTHROUGH
    };
};
