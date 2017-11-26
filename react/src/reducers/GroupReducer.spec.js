import GroupReducer from './GroupReducer';
import GROUP from '../resources/group';

const initialState = GROUP;

describe('Group Reducer', ()=> {
    it ('should have default initial state when passed undefined', () => {
        expect(GroupReducer(undefined, {})).toEqual(initialState);
    });
});