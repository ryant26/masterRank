import React from 'react';
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

    it('should render UserCard component when page loads', () => {
        expect(UserButtonComponent.find(UserCard)).toHaveLength(1);
    });

    it('should call updateUserAction and redirect user to blizzard auth when button is clicked', () => {
        window.location.assign = jest.fn();
        UserButtonComponent.find('button').simulate('click');
        let redirectUrl = UserButtonComponent.instance().redirectUrl();
        expect(window.location.assign).toBeCalledWith(redirectUrl);
    });
});