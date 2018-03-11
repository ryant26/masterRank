import * as WalkthroughActionTypes from '../../actiontypes/walkthrough';
import * as WalkthroughActions from './walkthrough';

describe('Start Walkthrough', () => {
    it ('should create the TOGGLE_WALKTHROUGH action', () => {
        expect(WalkthroughActions.toggleWalkthrough())
            .toEqual({
                type: WalkthroughActionTypes.TOGGLE_WALKTHROUGH,
            });
    });
});