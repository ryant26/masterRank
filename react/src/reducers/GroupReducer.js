import * as GroupHeroActionTypes from '../actiontypes/group';

const initialState = {
    groupId: null,
    members: [],
    pending: []
};


export default function GroupReducer(state=initialState, action) {
    switch(action.type) {
        case GroupHeroActionTypes.UPDATE_GROUP:
            return action.updatedGroupData;
        default:
            return state;
    }
}