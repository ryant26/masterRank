import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import GDPRButton from 'components/Sidebar/SidebarFooter/GDPRButton/GDPRButton';
import { home } from 'components/Routes/links';
import { logout }from 'actionCreators/app';
jest.mock('actionCreators/app', () => ({
    logout: jest.fn(() => ({type: 'sometype'}))
}));
import { clearAccessToken } from 'utilities/localStorage/localStorageUtilities';
jest.mock('utilities/localStorage/localStorageUtilities');

import * as mockUtils from "utilities/test/mockingUtilities";
import removePlayerAsync from 'api/playerApi/removePlayerAsync';
jest.mock('api/playerApi/removePlayerAsync');
import removePlayerHeroesAsync from 'api/heroApi/removePlayerHeroesAsync'; 
jest.mock('api/heroApi/removePlayerHeroesAsync');

describe('GDPR Button', () => {
    let GDPRComponent;
    let gdprButton;
    let removalButton;

    const setupAndFetchUserHerosRemove = (status = 200) => {
        let fetchPromise = Promise.resolve(
            mockUtils.getMockResponse(status, null, null)
        );
        window.fetch = jest.fn().mockImplementation(() => fetchPromise);
        return fetchPromise;
    };

    beforeEach(() => {
        let mockStore = configureStore();

        mockUtils.mockLocalStorage();
        mockUtils.mockLocation();

        GDPRComponent = shallow(<GDPRButton store={mockStore()}/>).dive();
        gdprButton = GDPRComponent.find('.gdprButton');
        removalButton = GDPRComponent.find('.button-six');

        removePlayerAsync.mockImplementation(() => Promise.resolve());
        removePlayerHeroesAsync.mockImplementation(() => Promise.resolve());

        return setupAndFetchUserHerosRemove();
    });

    afterEach(() => {
        removePlayerAsync.mockClear();
        removePlayerHeroesAsync.mockClear();
        logout.mockClear();
        clearAccessToken.mockClear();
    });

    it('should display modal with text info when gdpr modal button is clicked', () => {
        expect(GDPRComponent.state().modalOpen).toBe(false);
        gdprButton.simulate('click');
        expect(GDPRComponent.state().modalOpen).toBe(true);
    });

    it('should fetch removal in player api', () => {
        const accessToken = localStorage.getItem('accessToken');
        removalButton.simulate('click');
        expect(removePlayerAsync).toHaveBeenCalledWith(accessToken);
    });

    it('should fetch removal in hero api', () => {
        const accessToken = localStorage.getItem('accessToken');
        removalButton.simulate('click');
        expect(removePlayerHeroesAsync).toHaveBeenCalledWith(accessToken);
    });

    it('should clear access token', () => {
        expect(clearAccessToken).not.toHaveBeenCalled();
        removalButton.simulate('click');
        expect(clearAccessToken).toHaveBeenCalled();
    });

    it('should redirect to login page', () => {
        expect(window.location.assign).not.toHaveBeenCalled();
        removalButton.simulate('click');
        expect(window.location.assign).toHaveBeenCalledWith(home);
    });

    it('should call the logout action creator', () => {
        expect(logout).not.toHaveBeenCalled();
        removalButton.simulate('click');
        expect(logout).toHaveBeenCalled();
    });
});
