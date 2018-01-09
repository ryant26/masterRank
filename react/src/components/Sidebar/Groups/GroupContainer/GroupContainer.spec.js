import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import GROUP from '../../../../resources/group';


import GroupContainer from './GroupContainer';

const mockStore = configureStore();

describe('Group Hero Container',()=> {
    let store;

    beforeEach(() => {
        store = mockStore({
            user: {
                platformDisplayName: 'scott1'
            },
            group: {
                groupId: null,
                members: [],
                pending: []
            }
        });

        jest.useFakeTimers();       
    });
    
    it('should render without exploding', () => {
        const wrapper = mount(
            <GroupContainer store={store} />
        );
        
        const GroupContainerComponent = wrapper.find(GroupContainer);
        expect(GroupContainerComponent).toBeTruthy();
    });

    it('should render a group leader as first member', () => {
        store = mockStore({
            user: {
                platformDisplayName: 'scott1'
            },
            group: GROUP[1]
        });
        const component = renderer.create(
            <GroupContainer store={store}/>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should render four pending members plus you and the leader', () => {
        store = mockStore({
            user: {
                platformDisplayName: 'scott1'
            },
            group: GROUP[3]
        });

        const component = renderer.create(
            <GroupContainer store={store}/>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should not render leave group when you are the leader', () => {
        store = mockStore({
            user: {
                platformDisplayName: 'scott1'
            },
            group: GROUP[0]
        });

        const component = renderer.create(
            <GroupContainer store={store}/>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    xit('should remove pending user after 30 seconds', () => {
        // store = mockStore({
        //     user: {
        //         platformDisplayName: 'scott1'
        //     },
        //     group: GROUP[3]
        // });

        // const component = renderer.create(
        //     <GroupContainer store={store}/>
        // );
        // jest.runAllTimers();
        // expect(setTimeout).toHaveBeenCalledTimes(4);
    });
});
