import WalkthroughReducer from './WalkthroughReducer';
import * as WalkthroughActionTypes from '../../actiontypes/walkthrough';

describe('Walkthrough Reducer', () => {

    describe('when state is undefined', () => {
        it ('should have default initial state of undefined', () => {
            expect(WalkthroughReducer(undefined, {})).toEqual({});
        });

        it('should handle RUN_WALKTHROUGH by setting walkthrough to "run"', () => {
            expect(WalkthroughReducer(undefined, {
                type: WalkthroughActionTypes.RUN_WALKTHROUGH
            })).toEqual({ state: 'run' });
        });

        it('should handle FINISH_WALKTHROUGH by setting walkthrough to "finished"', () => {
            expect(WalkthroughReducer(undefined, {
                type: WalkthroughActionTypes.FINISH_WALKTHROUGH
            })).toEqual({ state: 'finished' });
        });
    });

    it('when state equals "finished" and RUN_WALKTHROUGH is handled the state should remain "finished"', () => {
        expect(WalkthroughReducer({ state: 'finished' }, {
            type: WalkthroughActionTypes.RUN_WALKTHROUGH
        })).toEqual({ state: 'finished' });
    });
});