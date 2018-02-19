import * as groupActionType from '../actiontypes/group';
import * as groupActionCreators from './group';

describe('updateGroup',() => {
    it ('should create the UPDATE_GROUP action', ()=> {
        const UpdatedGroupData = {heroName: 'genji'};
        expect(groupActionCreators.updateGroup(UpdatedGroupData))
            .toEqual({
                type: groupActionType.UPDATE_GROUP,
                updatedGroupData: UpdatedGroupData
            });
    });
});