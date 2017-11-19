import React from 'react';
import { mount } from 'enzyme';
import GROUP from '../../resources/group';
import configureStore from 'redux-mock-store';

import GroupContainer from './GroupContainer';
import * as users from '../../resources/users';

const mockStore = configureStore();

describe('Group Hero Container',()=> {
    let store;

    beforeEach(() => {
        store = mockStore({group: GROUP});
    });
    
    it ('should render without exploding', () => {
        const wrapper = mount(
            <GroupContainer user={users.users[0]} store={store} />
        );
        
        const GroupContainerComponent = wrapper.find(GroupContainer);
        expect(GroupContainerComponent).toBeTruthy();
    });
});
