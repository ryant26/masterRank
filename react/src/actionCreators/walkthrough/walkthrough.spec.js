import * as WalkthroughActionTypes from 'actiontypes/walkthrough';
import * as WalkthroughActions from 'actionCreators/walkthrough/walkthrough';

import { generateMockUser } from 'utilities/test/mockingUtilities';

describe('Walkthrough', () => {
    const user = generateMockUser();

    it ('should create the START_WALKTHROUGH action', () => {
        expect(WalkthroughActions.startWalkthrough(user.platformDisplayName))
            .toEqual({
                type: WalkthroughActionTypes.START_WALKTHROUGH,
                platformDisplayName: user.platformDisplayName,
                label: user.platformDisplayName
            });
    });

    it ('should create the FINISH_WALKTHROUGH action', () => {
        expect(WalkthroughActions.finishWalkthrough(user.platformDisplayName))
            .toEqual({
                type: WalkthroughActionTypes.FINISH_WALKTHROUGH,
                platformDisplayName: user.platformDisplayName,
                label: user.platformDisplayName
            });
    });
});