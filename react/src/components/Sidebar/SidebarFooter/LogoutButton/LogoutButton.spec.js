import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import LogoutButton from './LogoutButton';
import { home } from '../../../Routes/links';
import { logout }from '../../../../actionCreators/app';
jest.mock('../../../../actionCreators/app', () => ({
    logout: jest.fn(() => ({type: 'sometype'}))
}));

describe('Logout button', () => {
    describe('when clicked', () => {
        let logoutComponent;
        let logoutButton;

        beforeEach(() => {
            let mockStore = configureStore();

            window.location.assign = jest.fn();
            global.window.localStorage = { clear: jest.fn() };

            logoutComponent = shallow(<LogoutButton store={mockStore()}/>).dive();
            logoutButton = logoutComponent.find('.LogoutButton');
        });

        afterEach(() => {
            logout.mockClear();
        });

        it('should clear local storage', () => {
            expect(global.window.localStorage.clear).not.toHaveBeenCalled();
            logoutButton.simulate('click');
            expect(global.window.localStorage.clear).toHaveBeenCalled();
        });

        it('should redirect to login page', () => {
            expect(window.location.assign).not.toHaveBeenCalled();
            logoutButton.simulate('click');
            expect(window.location.assign).toHaveBeenCalledWith(home);
        });

        it('should call the logout action creator', () => {
            expect(logout).not.toHaveBeenCalled();
            logoutButton.simulate('click');
            expect(logout).toHaveBeenCalled();
        });
    });
});