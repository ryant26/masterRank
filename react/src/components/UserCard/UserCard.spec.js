import React from 'react';
import { mount } from 'enzyme';
import UserCard from './UserCard';
import * as users from '../../resources/users';

describe('User Card Component', () => {
    it('should render without exploding', () => {
        const wrapper = mount(
            <UserCard user={users.users[0]}/>
        );

        const UserCardComponent = wrapper.find(UserCard);
        expect(UserCardComponent).toBeTruthy();
        expect(JSON.stringify(UserCardComponent.props().user)).toBe(
            JSON.stringify(users.users[0])
        );
    });

    it('should render skill rating when present', () => {
        let userWithSkillRating = users.users[0];
        userWithSkillRating['skillRating'] = 2450;
        const wrapper = mount(
            <UserCard user={userWithSkillRating}/>
        );

        let UserCardComponent = wrapper.find(UserCard);
        expect(UserCardComponent).toBeTruthy();
        expect(JSON.stringify(UserCardComponent.props().user)).toBe(
            JSON.stringify(userWithSkillRating)
        );
    });
});