import WalkthroughReducer from './WalkthroughReducer';
import * as WalkthroughActionTypes from '../../actiontypes/walkthrough';

describe('Walkthrough Reducer', () => {

    it ('should have default initial state of undefined', () => {
        expect(WalkthroughReducer(undefined, {})).toEqual({state: 'run'});
    });

    it('should handle FINISH_WALKTHROUGH by setting walkthrough to "finished"', () => {
        expect(WalkthroughReducer({ state: 'run' }, {
            type: WalkthroughActionTypes.FINISH_WALKTHROUGH
        })).toEqual({ state: 'finished' });
    });
});