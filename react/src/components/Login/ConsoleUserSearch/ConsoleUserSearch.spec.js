import React from 'react';
import { shallow } from 'enzyme';
import 'isomorphic-fetch';

import ConsoleUserSearch from './ConsoleUserSearch';
import UserSelector from '../UserSelector/UserSelector';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { users as arrayUsers } from '../../../resources/users';

describe('ConsoleUserSearch', () => {
    let ConsoleUserSearchComponent;
    const handleSubmitSpy = jest.spyOn(ConsoleUserSearch.prototype, "handleSubmit");

    beforeEach(() => {
        ConsoleUserSearchComponent = shallow(
            <ConsoleUserSearch platform="xbl"/>)
        ;
    });

    it('should render when component loads', () => {
        expect(ConsoleUserSearchComponent).toHaveLength(1);
    });

    it('should render search box and button when component mounts', () => {
        expect(ConsoleUserSearchComponent.find('input')).toHaveLength(1);
        expect(ConsoleUserSearchComponent.find('.input-button')).toHaveLength(1);
    });

    it('should load search box placeholder to "Enter Full XBL or PSN Gamertag..." when page loads', () => {
        expect(ConsoleUserSearchComponent.find('input').prop('placeholder'))
            .toBe("Enter your PSN, or Xbox gamertag");
    });

    it('should disable search button when page loads', () => {
        expect(ConsoleUserSearchComponent.find('.input-button').prop('disabled')).toBe(true);
    });

    it('should enable search button once a display name is given', () => {
        ConsoleUserSearchComponent.setState({displayName: arrayUsers[0]});
        expect(ConsoleUserSearchComponent.find('.input-button').prop('disabled')).toBe(false);
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
        ConsoleUserSearchComponent.setState({
            users: arrayUsers,
        });
        expect(ConsoleUserSearchComponent.find(UserSelector)).toHaveLength(1);
        expect(ConsoleUserSearchComponent.find('input')).toHaveLength(1);
        expect(ConsoleUserSearchComponent.find('.input-button')).toHaveLength(1);

        let UserSelectorComponent = ConsoleUserSearchComponent.find(UserSelector);
        expect(UserSelectorComponent).toHaveLength(1);
        expect(UserSelectorComponent.prop('users')).toBe(arrayUsers);
    });

    it('should return api url with sanitized display name when passed display names', () => {
        let platform = 'xbl';
        ConsoleUserSearchComponent.setProps({
            platform: platform,
        });
        let displayName = arrayUsers[0].platformDisplayName;
        let sanitizeDisplayName = displayName.replace(/#/g, '-');
        expect(ConsoleUserSearchComponent.instance().sanitize(displayName)).toEqual(sanitizeDisplayName);
        expect(ConsoleUserSearchComponent.instance().urlForUserSearch(displayName))
            .toEqual(`/api/players/search?platformDisplayName=${sanitizeDisplayName}&platform=${platform}`);
    });

    it('should call handleSubmit when search button is clicked', () => {
        window.fetch = jest.fn().mockImplementation(() => Promise.resolve({}));
        ConsoleUserSearchComponent.find('form').simulate('submit', { preventDefault() {} });
        expect(handleSubmitSpy).toHaveBeenCalled();
    });

    it('should render loading spinner when isSearching is true', () => {
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

    xit('should display "No matches found! please try again" when no users match the displayName given', () => {
        const mockResponse = (status, statusText, response) => {
                    return new Response(response, {
                        status: status,
                        statusText: statusText,
                        headers: {
                            'Content-type': 'application/json'
                        }
                    });
                };

        window.fetch = jest.fn().mockImplementation(() => Promise.resolve(
            mockResponse(200, null, JSON.stringify([]))
        ));

        ConsoleUserSearchComponent.find('form').simulate('submit', { preventDefault() {} });
        expect(ConsoleUserSearchComponent.find('input').at(0).prop('placeholder')).toBe("No matches found! please try again");
        expect(ConsoleUserSearchComponent.state().placeholder).toBe("No matches found! please try again");
    });
});