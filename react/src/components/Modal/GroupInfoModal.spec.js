import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import GroupInfoModal from './GroupInfoModal';
import Modal from './Modal';

import groups from '../../resources/groupInvites';
import { users } from '../../resources/users';

import GroupStatsContainer from '../Stats/GroupStatsContainer';

const mockStore = configureStore();

describe('Modal Component', () => {
    const group =  groups[0];
    const store = mockStore({
        group,
        user: users[0]
    });
    let wrapper;
    
    beforeEach(() => {
        wrapper = shallow(
            <GroupInfoModal store={store}/>
        ).dive();
    });
    
    it('should render without exploding', () => {
        expect(wrapper.find(Modal)).toBeTruthy();
    });

    it('should render group stats container', () => {
        expect(wrapper.find(GroupStatsContainer)).toBeTruthy();
    });

    it('should pass group to group stats container props', () => {
        expect(wrapper.find(GroupStatsContainer).props().group).toBe(group);
    });

    it('should pass isLeading is false to group stats container props', () => {
        expect(wrapper.find(GroupStatsContainer).props().isLeading).toBe(false);
    });

    it('should have toggleModal in group stats container props', () => {
        expect(wrapper.find(GroupStatsContainer).props().toggleModal).toBeDefined();
    });
});