import * as groupActionType from 'actiontypes/group';
import * as groupActionCreators from 'actionCreators/group/group';

describe('updateGroup',() => {
    it ('should create the UPDATE_GROUP action', ()=> {
        const UpdatedGroupData = {heroName: 'genji'};
        expect(groupActionCreators.updateGroup(UpdatedGroupData))
            .toEqual({
                type: groupActionType.UPDATE_GROUP,
                updatedGroupData: UpdatedGroupData
            });
    });

    it ('should create the INITIALIZE_GROUP action', ()=> {
        expect(groupActionCreators.initializeGroup())
            .toEqual({
                type: groupActionType.INITIALIZE_GROUP,
            });
    });
});