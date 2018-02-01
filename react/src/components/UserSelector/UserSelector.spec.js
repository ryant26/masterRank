import React from 'react';
import { shallow } from 'enzyme';

import Store from '../../model/store';
import { users as arrayUsers} from '../../resources/users';
import UserSelector from './UserSelector';
import UserCard from '../UserCard/UserCard';

describe('UserSelector', () => {
    let UserSelectorComponent;

    beforeEach(() => {
        UserSelectorComponent = shallow(
            <UserSelector users={arrayUsers} store={Store}/>
        ).dive();
    });

    it('should render', () => {
        expect(UserSelectorComponent).toHaveLength(1);
    });

    it('should render a UserButton component for the users that where passed in', () => {
        expect(UserSelectorComponent.find(UserCard)).toHaveLength(2);
        expect(UserSelectorComponent.find(UserCard).at(0).prop('user')).toBe(arrayUsers[0]);
        expect(UserSelectorComponent.find(UserCard).at(1).prop('user')).toBe(arrayUsers[1]);
    });
});