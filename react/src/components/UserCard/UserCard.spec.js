import React from 'react';
import { shallow } from 'enzyme';
import UserCard from './UserCard';
import * as users from '../../resources/users';

const getUserCard = (user = users.users[0], region, showRank) => {
    return shallow(
        <UserCard user={user} region={region} showRank={showRank}/>
    );
};

describe('User Card Component', () => {
    it('should render without exploding', () => {
        const wrapper = getUserCard();

        expect(wrapper).toBeTruthy();
        expect(wrapper.find('.display-name').text()).toBe(users.users[0].platformDisplayName);
    });

    it('should render skill rating when present', () => {
        let userWithSkillRating = users.users[0];
        userWithSkillRating['skillRating'] = 2450;
        const wrapper = getUserCard(userWithSkillRating);

        expect(wrapper.find('.account-detail').length).toBe(2);
        expect(wrapper.find('.account-detail').first().text()).toEqual('2450');
    });

    it('should not render any rank information when showRank cleared', () => {
        let userWithoutSkillRating = users.users[0];
        userWithoutSkillRating['skillRating'] = null;
        const wrapper = getUserCard(userWithoutSkillRating, undefined, false);

        expect(wrapper.find('.account-detail').length).toBe(1);
    });

    it('should render "Unranked" when showRank set and no rank data', () => {
        let userWithoutSkillRating = users.users[0];
        userWithoutSkillRating['skillRating'] = null;
        const wrapper = getUserCard(userWithoutSkillRating);

        expect(wrapper.find('.account-detail').length).toBe(2);
        expect(wrapper.find('.account-detail').first().text()).toBe('Unranked');

    });

    it('should render region when passed', () => {
        let userWithSkillRating = users.users[0];
        userWithSkillRating['skillRating'] = 2450;
        const wrapper = getUserCard(userWithSkillRating, 'us');

        expect(wrapper.find('.account-detail').length).toBe(3);
        expect(wrapper.find('.account-detail').at(2).text()).toBe('US');
    });
});