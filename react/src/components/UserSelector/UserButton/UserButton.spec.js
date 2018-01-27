import React from 'react';
import { shallow } from 'enzyme';

import { users } from '../../../resources/users';
import UserButton from './UserButton';
import UserCard from '../../UserCard/UserCard';

describe('User Button', () => {
    let UserButtonComponent;

    beforeEach(function() {
        UserButtonComponent = shallow(
            <UserButton user={users[0]} />
        );
    });

    it('should set prop user to the correct value', () => {
        expect(UserButtonComponent.find(UserCard).prop('user')).toEqual(users[0]);
    });

    it('should render UserCard component when page loads', () => {
        expect(UserButtonComponent.find(UserCard)).toHaveLength(1);
    });

    it('should redirect user to blizzard auth when button is clicked', () => {
        window.location.assign = jest.fn();
        UserButtonComponent.find('button').simulate('click');
        let redirectUrl = UserButtonComponent.instance().redirectUrl();
        expect(window.location.assign).toBeCalledWith(redirectUrl);
    });
});