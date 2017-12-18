import React from 'react';
import { mount } from 'enzyme';
import GROUP from '../../../../resources/group';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';

import GroupContainer from './GroupContainer';
import * as users from '../../../../resources/users';

const mockStore = configureStore();

describe('Group Hero Container',()=> {
    let store;

    beforeEach(() => {
        store = mockStore({groupHeroes: GROUP});
    });
    
    it ('should render without exploding', () => {
        const wrapper = mount(
            <GroupContainer user={users.users[0]} store={store} />
        );
        
        const GroupContainerComponent = wrapper.find(GroupContainer);
        expect(GroupContainerComponent).toBeTruthy();
    });

    it ('should render a group leader as first member which is you', () => {
        const component = renderer.create(
            <GroupContainer store={store}/>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    xit ('should render two group joiners plus you', () => {
    
    });

    xit ('should render three group joiners plus you', () => {
        
    });

    xit ('should render four group joiners plus you', () => {
        
    });

    xit ('should render five group joiners plus you', () => {
        
    });
});
