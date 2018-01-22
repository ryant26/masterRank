import React from 'react';
import { Redirect } from 'react-router';
import { shallow } from 'enzyme';

import { users } from '../../../resources/users';
import Store from '../../../model/store';
import {updateUser as updateUserAction} from "../../../actions/user";
import UserButton from './UserButton';
import UserCard from '../../UserCard/UserCard';

describe('User Button', () => {
    let UserButtonContainer;
    let UserButtonComponent;

    beforeEach(function() {
        UserButtonContainer = shallow(
            <UserButton store={Store} user={users[0]} updateUserAction={updateUserAction}/>
        );

        UserButtonComponent = UserButtonContainer.dive();
    });

    it('should set prop user to the correct value', () => {
        expect(UserButtonContainer.prop('user')).toEqual(users[0]);
    });

    it('should set prop updateUserAction', () => {
        expect(UserButtonContainer.prop('updateUserAction')).toBeDefined();
    });

    it('should set fireRedirect to false, not redirect user, and render UserCard component when page loads', () => {
        expect(UserButtonComponent.state('fireRedirect')).toBe(false);
        expect(UserButtonComponent.find(Redirect)).toHaveLength(0);
        expect(UserButtonComponent.find(UserCard)).toHaveLength(1);
    });

    it('should set fireRedirect to true, redirect user to "/", and not render UserCard component when button is clicked', () => {
        UserButtonComponent.find('button').simulate('click', { preventDefault() {} });
        expect(UserButtonComponent.state('fireRedirect')).toBe(true);
        expect(UserButtonComponent.find(Redirect)).toHaveLength(1);
        expect(UserButtonComponent.find(Redirect).prop('to')).toBe('/');
        expect(UserButtonComponent.find(UserCard)).toHaveLength(0);
    });
});