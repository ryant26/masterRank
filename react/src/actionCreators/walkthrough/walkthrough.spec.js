import * as WalkthroughActionTypes from '../../actiontypes/walkthrough';
import * as WalkthroughActions from './walkthrough';

describe('Walkthrough', () => {
    it ('should create the RUN_WALKTHROUGH action', () => {
        expect(WalkthroughActions.runWalkthrough())
            .toEqual({
                type: WalkthroughActionTypes.RUN_WALKTHROUGH,
            });
    });

    it ('should create the FINISH_WALKTHROUGH action', () => {
        expect(WalkthroughActions.finishWalkthrough())
            .toEqual({
                type: WalkthroughActionTypes.FINISH_WALKTHROUGH,
            });
    });
});