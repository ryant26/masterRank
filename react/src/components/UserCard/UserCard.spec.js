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
            JSON.stringify({
                "_id": 12,
                "platformDisplayName": "PwNShoPP#1662",
                "lastUpdated": "2017-10-15T01:43:36.459Z",
                "platform": "pc",
                "level": 155,
                "portrait": "https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/0x025000000000115A.png",
                "region": "us",
                "skillRating": 2450
            })
        );
    });
});