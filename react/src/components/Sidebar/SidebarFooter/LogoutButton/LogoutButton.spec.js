import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import LogoutButton from 'components/Sidebar/SidebarFooter/LogoutButton/LogoutButton';
import { home } from 'components/Routes/links';
import { logout }from 'actionCreators/app';
jest.mock('actionCreators/app', () => ({
    logout: jest.fn(() => ({type: 'sometype'}))
}));
import { clearAccessToken } from 'utilities/localStorage/localStorageUtilities';
jest.mock('utilities/localStorage/localStorageUtilities');

import { mockLocation } from "utilities/test/mockingUtilities";

describe('Logout button', () => {
    describe('when clicked', () => {
        let logoutComponent;
        let logoutButton;

        beforeEach(() => {
            let mockStore = configureStore();

            mockLocation();

            logoutComponent = shallow(<LogoutButton store={mockStore()}/>).dive();
            logoutButton = logoutComponent.find('.LogoutButton');
        });

        afterEach(() => {
            logout.mockClear();
            clearAccessToken.mockClear();
        });

        it('should clear access token', () => {
            expect(clearAccessToken).not.toHaveBeenCalled();
            logoutButton.simulate('click');
            expect(clearAccessToken).toHaveBeenCalled();
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