import React from 'react';
import { shallow } from 'enzyme';

import { users as arrayUsers } from '../../resources/users';
import LoginPage from './LoginPage';
import UserSelector from '../../components/UserSelector/UserSelector';
import 'isomorphic-fetch';

describe('Login Page', () => {
    const handleSubmitSpy = jest.spyOn(LoginPage.prototype, "handleSubmit");
    let LoginPageComponent;

    beforeEach(function() {
        LoginPageComponent = shallow(
            <LoginPage />
        );

    });

    it('should render search box and button when page loads', () => {
        expect(LoginPageComponent.find('.input-component')).toHaveLength(1);
        expect(LoginPageComponent.find('form')).toHaveLength(1);
        expect(LoginPageComponent.find('.input-component')).toHaveLength(1);
        expect(LoginPageComponent.find('input')).toHaveLength(2);
    });

    it('should load search box placeholder to "Enter Full Battletag, PSN, or Xbox Gamertag..." when page loads', () => {
        expect(LoginPageComponent.find('input').at(0).prop('placeholder'))
            .toBe("Enter Full Battletag, PSN, or Xbox Gamertag...");
    });

    it('should disable search button when page loads', () => {
        expect(LoginPageComponent.find('input').at(1).prop('disabled')).toBe(true);
    });

    it('should not render UserSelector when page loads', () => {
        expect(LoginPageComponent.find(UserSelector)).toHaveLength(0);
    });

    it('should enable search button once a display name is given', () => {
        LoginPageComponent.setState({displayName: arrayUsers[0]});
        expect(LoginPageComponent.find('input').at(1).prop('disabled')).toBe(false);
    });

    it('should change state displayName when a value is input into the search bar', () => {
        LoginPageComponent.find('input').at(0).simulate('change', {target: {value: arrayUsers[0].platformDisplayName}});
        expect(LoginPageComponent.state('displayName')).toBe(arrayUsers[0].platformDisplayName);
    });

    it('should render UserSelector, search box, and button when when state users is defined', () => {
        LoginPageComponent.setState({users: arrayUsers});
        expect(LoginPageComponent.find('.input-component')).toHaveLength(1);
        expect(LoginPageComponent.find('form')).toHaveLength(1);
        expect(LoginPageComponent.find('.input-component')).toHaveLength(1);
        expect(LoginPageComponent.find('input')).toHaveLength(2);
        let UserSelectorComponent = LoginPageComponent.find(UserSelector);
        expect(UserSelectorComponent).toHaveLength(1);
        expect(UserSelectorComponent.prop('users')).toBe(arrayUsers);
    });

    it('should return api url with sanitized display name when passed display names', () => {
        let displayName = arrayUsers[0].platformDisplayName;
        let sanitizeDisplayName = displayName.replace(/#/g, '-');
        expect(LoginPageComponent.instance().sanitize(displayName)).toEqual(sanitizeDisplayName);
        expect(LoginPageComponent.instance().urlForUserSearch(displayName))
            .toEqual(`/api/players/search?platformDisplayName=${sanitizeDisplayName}`);
    });

    it('should call handleSubmit when search button is clicked', () => {
        window.fetch = jest.fn().mockImplementation(() => Promise.resolve({}));
        LoginPageComponent.find('form').simulate('submit', { preventDefault() {} });
        expect(handleSubmitSpy).toHaveBeenCalled();
    });

    //TODO: Dont know the best way to do this type of testing, but I dont think its worth stalling other features for now.
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

        LoginPageComponent.find('form').simulate('submit', { preventDefault() {} });
        expect(LoginPageComponent.find('input').at(0).prop('placeholder')).toBe("No matches found! please try again");
        expect(LoginPageComponent.state().placeholder).toBe("No matches found! please try again");
    });

});