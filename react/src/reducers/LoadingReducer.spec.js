import LoadingReducer from 'reducers/LoadingReducer';
import * as LoadingActionTypes from 'actiontypes/loading';

const initialState = {
    blockUI: 0
};

describe('Loading Reducer', () => {
    it ('should have default initial state when passed undefined', () => {
        expect(LoadingReducer(undefined, {})).toEqual(initialState);
    });

    it ('should handle PUSH_BLOCKING_EVENT by incrementing the blockUI event counter', () => {
        expect(LoadingReducer(initialState, {
            type: LoadingActionTypes.PUSH_BLOCKING_EVENT
        })).toEqual({
            blockUI: 1
        });
    });

    it ('should handle POP_BLOCKING_EVENT by decrementing the blockUI event counter', () => {
        expect(LoadingReducer({blockUI: 1}, {
            type: LoadingActionTypes.POP_BLOCKING_EVENT,
        })).toEqual(initialState);
    });

    it ('should not allow the counter to go negative', () => {
        expect(LoadingReducer(initialState, {
            type: LoadingActionTypes.POP_BLOCKING_EVENT,
        })).toEqual(initialState);
    });
});