import * as LoadingActionTypes from 'actiontypes/loading';
import * as LoadingActionCreators from 'actionCreators/loading';

describe('pushLoadingEvent', () => {
    it ('should create the PUSH_BLOCKING_EVENT action', () => {
        expect(LoadingActionCreators.pushBlockingEvent())
        .toEqual({
            type: LoadingActionTypes.PUSH_BLOCKING_EVENT
        });
    });
});

describe('popLoadingEvent', () => {
    it ('should create the POP_BLOCKING_EVENT action', () => {
        expect(LoadingActionCreators.popBlockingEvent())
            .toEqual({
                type: LoadingActionTypes.POP_BLOCKING_EVENT
            });
    });
});
