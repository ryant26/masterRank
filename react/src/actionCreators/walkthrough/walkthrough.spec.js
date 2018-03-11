import * as WalkthroughActionTypes from '../../actiontypes/walkthrough';
import * as WalkthroughActions from './walkthrough';

describe('Walkthrough', () => {
    it ('should create the RUN_WALKTHROUGH action', () => {
        expect(WalkthroughActions.runWalkthrough())
            .toEqual({
                type: WalkthroughActionTypes.RUN_WALKTHROUGH,
            });
    });

    it ('should create the FINISHED_WALKTHROUGH action', () => {
        expect(WalkthroughActions.finishedWalkthrough())
            .toEqual({
                type: WalkthroughActionTypes.FINISHED_WALKTHROUGH,
            });
    });
});