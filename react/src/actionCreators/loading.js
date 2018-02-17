import * as LoadingActionTypes from '../actiontypes/loading';

export const pushBlockingEvent = () => {
  return {
    type: LoadingActionTypes.PUSH_BLOCKING_EVENT
  };
};

export const popBlockingEvent = () => {
    return {
        type: LoadingActionTypes.POP_BLOCKING_EVENT
    };
};
