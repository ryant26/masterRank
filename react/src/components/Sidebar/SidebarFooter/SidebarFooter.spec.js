import React from 'react';
import { shallow } from 'enzyme';

import SidebarFooter from './SidebarFooter';
import FeedbackButton from './FeedbackButton/FeedbackButton';
import LogoutButton from './LogoutButton/LogoutButton';

const shallowSidebarFooter = () => {
    return shallow(
        <SidebarFooter/>
    );
};

describe('SelectorButton Component',()=> {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowSidebarFooter();
    });

    it('should render without exploding', () => {
        expect(wrapper).toHaveLength(1);
    });

    it('should mount FeedbackButton', () => {
        expect(wrapper.find(FeedbackButton)).toHaveLength(1);
    });

    it('should mount LogoutButton', () => {
        expect(wrapper.find(LogoutButton)).toHaveLength(1);
    });
});