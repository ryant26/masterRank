import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import 'isomorphic-fetch';

import ConsoleUserSearch from 'components/Login/ConsoleUserSearch/ConsoleUserSearch';
import UserSelector from 'components/Login/UserSelector/UserSelector';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { clickConsoleUserSearchTrackingEvent } from 'actionCreators/googleAnalytic/googleAnalytic';
jest.mock('actionCreators/googleAnalytic/googleAnalytic');

import { users as arrayUsers } from 'resources/users';

const mockResponse = (status, statusText, jsonObj) => {
    return new Response(JSON.stringify(jsonObj), {
        status: status,
        statusText: statusText,
        headers: {
            'Content-type': 'application/json'
        }
    });
};

const mockStore = configureStore();
const getConsoleUserSearchComponent = (platform, disabled, region) => {
    let store = mockStore({});
    store.dispatch = jest.fn();
    return shallow(
        <ConsoleUserSearch platform={platform} store={store} disabled={disabled} region={region}/>
    ).dive();
};

describe('ConsoleUserSearch', () => {
    let handleSubmitSpy;
    const platform = 'xbl';
    const disabled = false;
    const region = 'eu';
    const displayName = arrayUsers[0].platformDisplayName;
    const sanitizeDisplayName = displayName.replace(/#/g, '-');
    const fetchUrl = `/api/players/search?platformDisplayName=${sanitizeDisplayName}&platform=${platform}`;
    let ConsoleUserSearchComponent;

    beforeEach(() => {
        ConsoleUserSearchComponent = getConsoleUserSearchComponent(platform, disabled, region);
        handleSubmitSpy = jest.spyOn(ConsoleUserSearchComponent.instance(), "handleSubmit");
    });

    it('should render when component loads', () => {
        expect(ConsoleUserSearchComponent).toHaveLength(1);
    });

    it('should render search box and button when component mounts', () => {
        expect(ConsoleUserSearchComponent.find('input')).toHaveLength(1);
        expect(ConsoleUserSearchComponent.find('.button-primary')).toHaveLength(1);
    });

    it('should load search box placeholder to "Enter Full XBL or PSN Gamertag..." when page loads', () => {
        expect(ConsoleUserSearchComponent.find('input').prop('placeholder'))
            .toBe("Enter your PSN, or Xbox gamertag");
    });

    it('should disable search button when page loads', () => {
        expect(ConsoleUserSearchComponent.find('.button-primary').prop('disabled')).toBe(true);
    });

    it('should change state displayName when a value is input into the search bar', () => {
        ConsoleUserSearchComponent.find('input').simulate('change', {target: {value: arrayUsers[0].platformDisplayName}});
        expect(ConsoleUserSearchComponent.state('displayName')).toBe(arrayUsers[0].platformDisplayName);
    });

    it('should not render UserSelector when user is not defined', () => {
        ConsoleUserSearchComponent.setState({
            users: undefined,
        });
        expect(ConsoleUserSearchComponent.find(UserSelector)).toHaveLength(0);
    });

    it('should render UserSelector, search box, and button when when state users is defined', () => {
        expect(ConsoleUserSearchComponent.find(UserSelector)).toHaveLength(0);
        ConsoleUserSearchComponent.setState({
            users: arrayUsers,
        });
        expect(ConsoleUserSearchComponent.find(UserSelector)).toHaveLength(1);
        expect(ConsoleUserSearchComponent.find('input')).toHaveLength(1);
        expect(ConsoleUserSearchComponent.find('.button-primary')).toHaveLength(1);

        let UserSelectorComponent = ConsoleUserSearchComponent.find(UserSelector);
        expect(UserSelectorComponent).toHaveLength(1);
        expect(UserSelectorComponent.prop('users')).toBe(arrayUsers);
    });

    it('should return api url with sanitized display name when passed display names', () => {
        ConsoleUserSearchComponent.setProps({
            platform: platform,
        });
        expect(ConsoleUserSearchComponent.instance().sanitize(displayName)).toEqual(sanitizeDisplayName);
        expect(ConsoleUserSearchComponent.instance().urlForUserSearch(displayName)).toEqual(fetchUrl);
    });

    it('should render loading spinner when isSearching is true', () => {
        expect(ConsoleUserSearchComponent.find(LoadingSpinner)).toHaveLength(0);
        ConsoleUserSearchComponent.setState({
            isSearching: true,
        });
        expect(ConsoleUserSearchComponent.find(LoadingSpinner)).toHaveLength(1);
    });

    it('should not render searching message when isSearching is false', () => {
        ConsoleUserSearchComponent.setState({
            isSearching: false,
        });

        expect(ConsoleUserSearchComponent.find('.isSearching')).toHaveLength(0);
    });

    it('should set state.users to undefined when a new prop is received', () => {
        ConsoleUserSearchComponent.setState({
            users: arrayUsers,
        });
        expect(ConsoleUserSearchComponent.state().users).toBe(arrayUsers);
        ConsoleUserSearchComponent.setProps({
            platform: 'psn',
        });
        expect(ConsoleUserSearchComponent.state().users).toBeUndefined();
    });

    it('should enable search button once a display name is given', () => {
        expect(ConsoleUserSearchComponent.find('.button-primary').prop('disabled')).toBe(true);
        ConsoleUserSearchComponent.setState({
            displayName: arrayUsers[0].platformDisplayName
        });
        expect(ConsoleUserSearchComponent.find('.button-primary').prop('disabled')).toBe(false);
    });

    describe('search button on gdpr compliance', () => {
        
        it('should be disabled when disabled is true and region is eu even with display name present', () => {
            const region = 'eu';
            const platform = 'pc';
            const disabled = true;
            ConsoleUserSearchComponent = getConsoleUserSearchComponent(platform, disabled, region);
            ConsoleUserSearchComponent.setState({
                displayName: arrayUsers[0].platformDisplayName
            });
            expect(ConsoleUserSearchComponent.find('.button-primary').props().disabled).toBe(true);
        });
    
        it('should be enabled when disabled is false and region is eu with display name present', () => {
            const region = 'eu';
            const platform = 'pc';
            const disabled = false;
            ConsoleUserSearchComponent = getConsoleUserSearchComponent(platform, disabled, region);
            ConsoleUserSearchComponent.setState({
                displayName: arrayUsers[0].platformDisplayName
            });
            expect(ConsoleUserSearchComponent.find('.button-primary').props().disabled).toBe(false);
        });
    });

    describe('when displayName is entered and search button is clicked', () => {

        beforeEach(() => {
            ConsoleUserSearchComponent.setState({
                displayName: displayName
            });
            expect(clickConsoleUserSearchTrackingEvent).not.toHaveBeenCalled();
            window.fetch = jest.fn().mockImplementation(() => Promise.resolve({}));
            ConsoleUserSearchComponent.find('.button-primary').simulate('click');
        });

        afterEach(() => {
            clickConsoleUserSearchTrackingEvent.mockClear();
        });

        it('should dispatch clickConsoleUserSearch with queried displayName', () => {
            expect(clickConsoleUserSearchTrackingEvent).toHaveBeenCalledWith(displayName);
        });

        it('should set state isSearching to true', () => {
            expect(ConsoleUserSearchComponent.state().isSearching).toBe(true);
        });

        it('should set state lastSearch to state display name', () => {
            expect(ConsoleUserSearchComponent.state().lastSearch).toBe(displayName);
        });

        it('should set state users to true', () => {
            expect(ConsoleUserSearchComponent.state().users).toBe(undefined);
        });
    });

    describe('when display name is set form is submitted and fetch returns no users', () => {

        beforeEach(() => {
            let fetchPromise = Promise.resolve(mockResponse(200, null, []));
            window.fetch = jest.fn().mockImplementation(() => fetchPromise);
            ConsoleUserSearchComponent.setState({
                displayName: displayName
            });

            ConsoleUserSearchComponent.find('form').simulate('submit', { preventDefault() {} });
            return fetchPromise;
        });

        it('should call handleSubmit', () => {
            expect(handleSubmitSpy).toHaveBeenCalled();
        });

        it('should fetch from the correct url', () => {
            expect(window.fetch).toHaveBeenCalledWith(fetchUrl);
        });

        it('should display "No matches found! please try again"', () => {
            expect(ConsoleUserSearchComponent.state().placeholder).toBe("No matches found! please try again");
        });

        it('should set state isSearching to false', () => {
            expect(ConsoleUserSearchComponent.state().isSearching).toBe(false);
        });
    });

    describe('when display name is set and form is submitted and fetch returns users', () => {

        beforeEach(() => {
            let fetchPromise = Promise.resolve(mockResponse(200, null, arrayUsers));
            window.fetch = jest.fn().mockImplementation(() => fetchPromise);
            ConsoleUserSearchComponent.setState({
                displayName: displayName
            });

            ConsoleUserSearchComponent.find('form').simulate('submit', { preventDefault() {} });
            return fetchPromise;
        });

        it('should fetch from the correct url', () => {
            expect(window.fetch).toHaveBeenCalledWith(fetchUrl);
        });

        it('should set state users equal users fetch response users', () => {
            expect(ConsoleUserSearchComponent.state().users).toEqual(arrayUsers);
        });

        it('should set state isSearching to false', () => {
            expect(ConsoleUserSearchComponent.state().isSearching).toBe(false);
        });
    });

    describe('when display name is set and form is submitted and fetch returns a cache hit', () => {

        beforeEach(() => {
            let fetchPromise = Promise.resolve(mockResponse(304, null, arrayUsers));
            window.fetch = jest.fn().mockImplementation(() => fetchPromise);
            ConsoleUserSearchComponent.setState({
                displayName: displayName
            });

            ConsoleUserSearchComponent.find('form').simulate('submit', { preventDefault() {} });
            return fetchPromise;
        });

        it('should fetch from the correct url', () => {
            expect(window.fetch).toHaveBeenCalledWith(fetchUrl);
        });

        it('should set state users equal users fetch response users', () => {
            expect(ConsoleUserSearchComponent.state().users).toEqual(arrayUsers);
        });

        it('should set state isSearching to false', () => {
            expect(ConsoleUserSearchComponent.state().isSearching).toBe(false);
        });
    });
});