import React from 'react';
import { shallow } from 'enzyme';

import { users as arrayUsers} from '../../resources/users';
import UserSelector from './UserSelector';
import UserButton from './UserButton/UserButton';

describe('UserSelector', () => {
    let UserSelectorComponent;

    beforeEach(() => {
        UserSelectorComponent = shallow(
            <UserSelector users={arrayUsers} />
        );
    });

    it('should render', () => {
        expect(UserSelectorComponent).toHaveLength(1);
    });

    it('should render a UserButton component for the users that where passed in', () => {
        expect(UserSelectorComponent.find(UserButton)).toHaveLength(2);
        expect(UserSelectorComponent.find(UserButton).at(0).prop('user')).toBe(arrayUsers[0]);
        expect(UserSelectorComponent.find(UserButton).at(1).prop('user')).toBe(arrayUsers[1]);
    });
});