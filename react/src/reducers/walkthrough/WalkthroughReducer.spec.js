import WalkthroughReducer from './WalkthroughReducer';
import * as WalkthroughActionTypes from '../../actiontypes/walkthrough';

import { generateMockUser } from '../../utilities/test/mockingUtilities';

describe('Walkthrough Reducer', () => {
    const user = generateMockUser('user');
    const user2 = generateMockUser('user2');
    const initialState = {
        finished: {}
    };
    let expectedState;

    beforeEach(() => {
        expectedState = JSON.parse(JSON.stringify(initialState));
    });

    it ('should have default initial state of undefined', () => {
        expect(WalkthroughReducer(undefined, {})).toEqual(initialState);

    });

    it('on FINISH_WALKTHROUGH should adding platformDisplayName equal to true to state.finished', () => {
        expectedState.finished[user.platformDisplayName] = true;
        expect(WalkthroughReducer(initialState, {
            type: WalkthroughActionTypes.FINISH_WALKTHROUGH,
            platformDisplayName: user.platformDisplayName
        })).toEqual(expectedState);
    });

    it('on FINISH_WALKTHROUGH should add multiple platformDisplayNames to finished', () => {
        expectedState.finished[user.platformDisplayName] = true;
        let stateWithOneFinished = JSON.parse(JSON.stringify(expectedState));
        expect(Object.keys(stateWithOneFinished.finished).length).toBe(1);

        expectedState.finished[user2.platformDisplayName] = true;
        expect(Object.keys(expectedState.finished).length).toBe(2);

        expect(WalkthroughReducer(stateWithOneFinished, {
            type: WalkthroughActionTypes.FINISH_WALKTHROUGH,
            platformDisplayName: user2.platformDisplayName
        })).toEqual(expectedState);
    });

    it('on FINISH_WALKTHROUGH should not add duplicate platformDisplayNames to finished', () => {
        expectedState.finished[user.platformDisplayName] = true;
        let stateContainsPlatformDisplayName = JSON.parse(JSON.stringify(expectedState));

        expect(WalkthroughReducer(stateContainsPlatformDisplayName, {
            type: WalkthroughActionTypes.FINISH_WALKTHROUGH,
            platformDisplayName: user.platformDisplayName
        })).toEqual(expectedState);
    });
});