import React from 'react';
import { mount } from 'enzyme';
import InvitePlayerButton from './InvitePlayerButton';

describe('Invite Player Component',()=> {
    it('should render without exploding', () => {
        const wrapper = mount(
            <InvitePlayerButton /> 
        );

        const InvitePlayerButtonComponent = wrapper.find(InvitePlayerButton);
        expect(InvitePlayerButtonComponent).toBeTruthy();
    });
});