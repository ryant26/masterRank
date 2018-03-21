import React from 'react';
import { shallow } from 'enzyme';

import SidebarFooter from 'components/Sidebar/SidebarFooter/SidebarFooter';
import FeedbackButton from 'components/Sidebar/SidebarFooter/FeedbackButton/FeedbackButton';
import TutorialButton from 'components/Sidebar/SidebarFooter/TutorialButton/TutorialButton';
import LogoutButton from 'components/Sidebar/SidebarFooter/LogoutButton/LogoutButton';

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

    it('should mount TutorialButton', () => {
        expect(wrapper.find(TutorialButton)).toHaveLength(1);
    });

    it('should mount LogoutButton', () => {
        expect(wrapper.find(LogoutButton)).toHaveLength(1);
    });
});