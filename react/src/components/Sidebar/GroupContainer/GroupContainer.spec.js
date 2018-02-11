import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import GroupContainer from './GroupContainer';


const mockStore = configureStore();
const getGroupContainerComponent = () => {
    let store = mockStore({});

    return shallow(
       <GroupContainer store={store}/>
    );
};

describe('GroupContainer', () => {
    let GroupContainerComponent;

    beforeEach(() => {
        GroupContainerComponent = getGroupContainerComponent();
    });

    it('should render when component loads', () => {
        expect(GroupContainerComponent).toHaveLength(1);
    });

    xit('should render with className GroupContainer when component loads', () => {
        expect(GroupContainerComponent.hasClass('GroupContainer')).toBe(true);
    });

    xit('should create a new group when component mounts ', () => {

    });

    xit('should rerender when prop groups updates', () => {

    })
});