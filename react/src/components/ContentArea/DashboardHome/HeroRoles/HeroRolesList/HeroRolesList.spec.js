import React from 'react';
import { shallow } from 'enzyme';

import HeroRolesList from './HeroRolesList';
import HeroCard from '../HeroCard/HeroCard';
import heroes from '../../../../../resources/heroes';
import {users} from '../../../../../resources/users';


describe('HeroRolesList Component', () => {
    let wrapper;

    const getHeroRoles = ({heroes, role}) => {
        return shallow(
            <HeroRolesList heroes={heroes} role={role}/>
        );
    };

    beforeEach(() => {
        wrapper = getHeroRoles({
            heroes: [heroes[0]],
            role: 'tank'
        });
    });

    it('should render without exploding', () => {
        expect(wrapper).toHaveLength(1);
        expect(wrapper.find(HeroCard)).toHaveLength(1);
    });

    it('should render multiple heroCards', () => {
        wrapper = getHeroRoles({
            heroes: [heroes[0], heroes[1]],
            role: 'tank'
        });

        expect(wrapper.find(HeroCard)).toHaveLength(2);
    });

    it('should render a message when there are no hero cards', () => {
        wrapper = getHeroRoles({
            heroes: [],
            role: 'tank'
        });

        expect(wrapper.find('.empty-list-message > div').text()).toBe('No players online');
    });

    it('should render the container with hero cards sorted by winRate', () => {
        const heroWithLowerWinRate = heroes[0];
        const heroWithHigherWinRate = heroes[4];

        const lowerWinRate = heroWithLowerWinRate.stats.wins / heroWithLowerWinRate.stats.gamesPlayed;
        const higherWinRate = heroWithHigherWinRate.stats.wins / heroWithHigherWinRate.stats.gamesPlayed;

        wrapper = getHeroRoles({
            heroes: [heroWithLowerWinRate, heroWithHigherWinRate],
            role: 'tank',
            user: users[0]
        });

        expect(wrapper.find(HeroCard)).toHaveLength(2);
        expect(lowerWinRate).toBeLessThan(higherWinRate);
        expect(wrapper.find(HeroCard).first().props().hero.heroName).toBe(heroWithHigherWinRate.heroName);
    });

    describe('title should match the role prop', () => {
        const testMatchingTitleAndRole = (role) => {
            wrapper = getHeroRoles({
                heroes: [],
                role
            });

            expect(wrapper.find('h3').text()).toBe(role);
        };

        it('tank', () => {
            testMatchingTitleAndRole('tank');
        });

        it('support', () => {
            testMatchingTitleAndRole('support');
        });

        it('attack', () => {
            testMatchingTitleAndRole('attack');
        });

        it('defense', () => {
            testMatchingTitleAndRole('defense');
        });
    });
});