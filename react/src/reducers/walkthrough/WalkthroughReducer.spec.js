import WalkthroughReducer from 'reducers/walkthrough/WalkthroughReducer';
import * as WalkthroughActionTypes from 'actiontypes/walkthrough';

import { generateMockUser } from 'utilities/test/mockingUtilities';

describe('Walkthrough Reducer', () => {
    const user = generateMockUser('user');
    const user2 = generateMockUser('user2');
    const initialState = {
        finished: {}
    };

    it ('should have default initial state of undefined', () => {
        expect(WalkthroughReducer(undefined, {})).toEqual(initialState);

    });

    describe('on START_WALKTHROUGH', () => {
        let startState;

        beforeEach(() => {
            startState = JSON.parse(JSON.stringify(initialState));
        });

        it("when user's platforDisplayName is in finished START_WALKTHROUGH should remove platformDisplayName from finished", () => {
            startState.finished[user.platformDisplayName] = true;

            expect(WalkthroughReducer(startState, {
                type: WalkthroughActionTypes.START_WALKTHROUGH,
                platformDisplayName: user.platformDisplayName
            })).toEqual(initialState);
        });

        it("when user's platforDisplayName is not in finished START_WALKTHROUGH return state passed in", () => {
            startState.finished["not" + user.platformDisplayName] = true;

            expect(WalkthroughReducer(startState, {
                type: WalkthroughActionTypes.START_WALKTHROUGH,
                platformDisplayName: user.platformDisplayName
            })).toEqual(startState);
        });

        it("START_WALKTHROUGH should return a new state object", () => {
            startState.finished["not" + user.platformDisplayName] = true;

            expect(WalkthroughReducer(startState, {
                type: WalkthroughActionTypes.START_WALKTHROUGH,
                platformDisplayName: user.platformDisplayName
            })).not.toBe(startState);
        });
    });

    describe('on FINISH_WALKTHROUGH', () => {
        let expectedState;

        beforeEach(() => {
            expectedState = JSON.parse(JSON.stringify(initialState));
        });

        it('should adding platformDisplayName equal to true to state.finished', () => {
            expectedState.finished[user.platformDisplayName] = true;
            expect(WalkthroughReducer(initialState, {
                type: WalkthroughActionTypes.FINISH_WALKTHROUGH,
                platformDisplayName: user.platformDisplayName
            })).toEqual(expectedState);
        });

        it('should add multiple platformDisplayNames to finished', () => {
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

        it('should not add duplicate platformDisplayNames to finished', () => {
            expectedState.finished[user.platformDisplayName] = true;
            let stateContainsPlatformDisplayName = JSON.parse(JSON.stringify(expectedState));

            expect(WalkthroughReducer(stateContainsPlatformDisplayName, {
                type: WalkthroughActionTypes.FINISH_WALKTHROUGH,
                platformDisplayName: user.platformDisplayName
            })).toEqual(expectedState);
        });
    });

});