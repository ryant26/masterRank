import * as PreferredHeroActionTypes from '../actiontypes/preferredHeroes';

const initialState = {
    heroes: [],
    selectedSlot: 1
};

const maxSlots = 5;

const incrementSelectedSlot = (newState) => {
    if (newState.selectedSlot <  maxSlots) {
        newState.selectedSlot++;
    }
};

const copyState = (oldState) => {
    return {
        heroes: [...oldState.heroes],
        selectedSlot: oldState.selectedSlot
    };
};

export default function PreferredHeroesReducer(state=initialState, action) {
  switch(action.type) {
    case PreferredHeroActionTypes.ADD_HERO:
        if (!state.heroes.includes(action.hero)) {
            let newState = copyState(state);
            newState.heroes.splice(action.preference - 1, 1, action.hero);
            incrementSelectedSlot(newState);

            return newState;
        }
        return state;
    case PreferredHeroActionTypes.SET_SELECTED_SLOT: {
        let newState = copyState(state);
        let newSlot;

        if(action.slot <= maxSlots) {
            if (action.slot <= state.heroes.length + 1) {
                newSlot = action.slot;
            } else {
                newSlot = state.heroes.length + 1;
            }
        } else {
            newSlot = maxSlots;
        }

        newState.selectedSlot = newSlot;
        return newState;
    }
    default:
      return state;
  }
}