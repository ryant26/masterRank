import * as WalkthroughActionTypes from '../../actiontypes/walkthrough';
import * as WalkthroughActions from './walkthrough';

describe('Walkthrough', () => {
    it ('should create the FINISH_WALKTHROUGH action', () => {
        expect(WalkthroughActions.finishWalkthrough())
            .toEqual({
                type: WalkthroughActionTypes.FINISH_WALKTHROUGH,
            });
    });
});