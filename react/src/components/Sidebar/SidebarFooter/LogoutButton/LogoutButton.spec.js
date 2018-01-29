import React from 'react';
import { shallow } from 'enzyme';

import LogoutButton from './LogoutButton';

describe('Logout button', () => {
    it('should clear local storage and redirect to login page when clicked', () => {
        window.location.assign = jest.fn();
        global.window.localStorage = { clear: jest.fn() };
        const LogoutComponent = shallow(<LogoutButton/>);
        LogoutComponent.find('.LogoutButton').simulate('click');

        expect(window.location.assign).toHaveBeenCalledWith('/login');
        expect(global.window.localStorage.clear).toHaveBeenCalled();
    });
});