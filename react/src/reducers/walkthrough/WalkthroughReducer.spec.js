import WalkthroughReducer from './WalkthroughReducer';
import * as WalkthroughActionTypes from '../../actiontypes/walkthrough';

describe('Walkthrough Reducer', () => {

    describe('when state is undefined', () => {
        it ('should have default initial state of undefined', () => {
            expect(WalkthroughReducer(undefined, {})).toEqual('');
        });

        it('should handle RUN_WALKTHROUGH by setting walkthrough to "run"', () => {
            expect(WalkthroughReducer(undefined, {
                type: WalkthroughActionTypes.RUN_WALKTHROUGH
            })).toEqual('run');
        });

        it('should handle FINISHED_WALKTHROUGH by setting walkthrough to "finished"', () => {
            expect(WalkthroughReducer(undefined, {
                type: WalkthroughActionTypes.FINISHED_WALKTHROUGH
            })).toEqual('finished');
        });
    });

    it('when state equals "finished" and RUN_WALKTHROUGH is handled the state should remain "finished"', () => {
        expect(WalkthroughReducer('finished', {
            type: WalkthroughActionTypes.RUN_WALKTHROUGH
        })).toEqual('finished');
    });
});