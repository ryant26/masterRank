import GroupReducer from './GroupReducer';
import * as GroupActionTypes from 'actiontypes/group';

import groupInvites from 'resources/groupInvites';

const initialState = {
    groupId: null,
    members: [],
    pending: []
};


describe('Group Reducer', ()=> {
    it ('should have default initial state when passed undefined', () => {
        expect(GroupReducer(undefined, {})).toEqual(initialState);
    });

    it ('should handle UPDATE_GROUP by replacing the old state with the new group', () => {
        expect(GroupReducer(initialState, {
            type: GroupActionTypes.UPDATE_GROUP,
            updatedGroupData: {
                groupId: null,
                leader: {platformDisplayName: 'jumpinjeezus', heroName: 'genji'},
                members: [],
                pending: []
            }
        })).toEqual({
            groupId: null,
            leader: {platformDisplayName: 'jumpinjeezus', heroName: 'genji'},
            members: [],
            pending: []
        });
    });

    it ('should handle LEAVE_GROUP by replacing the current group with initial state', () => {
        const group = groupInvites[0];
        expect(GroupReducer(group, {
            type: GroupActionTypes.LEAVE_GROUP,
        })).toEqual({
            groupId: null,
            members: [],
            pending: []
        });
    });
});