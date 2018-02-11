import * as LoadingActionTypes from '../actiontypes/loading';

const initalState = {
    blockUI: 0
};

export default function HeroReducer(state=initalState, action) {
  switch(action.type) {
      case LoadingActionTypes.PUSH_BLOCKING_EVENT: {
          return {
              blockUI: state.blockUI + 1
          };
      }
      case LoadingActionTypes.POP_BLOCKING_EVENT: {
          let out = {
              blockUI: state.blockUI
          };

          if (out.blockUI > 0) {
              out.blockUI--;
          }

          return out;
      }
    default:
      return state;
  }
}
