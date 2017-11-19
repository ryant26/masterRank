import * as GroupHeroActionTypes from '../actiontypes/groupHeroes';
import GROUP from '../resources/group';

const initialState = [...GROUP];

export default function GroupReducer(state=initialState, action) {
    switch(action.type) {
        case GroupHeroActionTypes.ADD_GROUP_HERO:
            return Object.assign({}, state, {
                group: [
                    ...state.group,
                    action.hero
                ]
            });
            default:
                return state;
    }
}