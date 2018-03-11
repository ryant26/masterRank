import WalkthroughReducer from './WalkthroughReducer';
import * as WalkthroughActionTypes from '../../actiontypes/walkthrough';

describe('Walkthrough Reducer', () => {

    it ('should have default initial state of false when undefined', () => {
        expect(WalkthroughReducer(undefined, {})).toEqual(false);
    });

    it('should handle TOGGLE_WALKTHROUGH by toggling the state from false to true', () => {
        expect(WalkthroughReducer(false, {
            type: WalkthroughActionTypes.TOGGLE_WALKTHROUGH
        })).toEqual(true);
    });

    it('should handle TOGGLE_WALKTHROUGH by toggling the state from false to true', () => {
        expect(WalkthroughReducer(true, {
            type: WalkthroughActionTypes.TOGGLE_WALKTHROUGH
        })).toEqual(false);
    });
});