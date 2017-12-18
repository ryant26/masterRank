import React from 'react';
import { mount } from 'enzyme';

import SidebarFooter from './sidebar-footer';

describe('SelectorButton Component',()=> {
    it('should render without exploding', () => {
        const wrapper = mount(
            <SidebarFooter/>
        );

        const SelectorButtonComponent = wrapper.find(SidebarFooter);

        expect(SelectorButtonComponent.length).toBeTruthy();
    });
});