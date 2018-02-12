import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import Model from '../../../../../model/model';
import HeroCard from './HeroCard';
import heroes from '../../../../../resources/heroes';
import { users } from '../../../../../resources/users';
import groupInvites from '../../../../../resources/groupInvites';

const mockStore = configureStore();
const getHeroCardComponent = (user, hero, group) => {
    let store = mockStore({
        group: group,
    });

    return shallow(
        <HeroCard user={user} hero={hero} store={store}/>
    ).dive();
};

describe('HeroCard Component',()=> {
    let HeroCardComponent;
    const group = groupInvites[0];
    let user;
    let hero;

    beforeEach(() => {
        user = users[0];
        hero = heroes[0];
        HeroCardComponent = getHeroCardComponent(user, hero, group);
    });

    it('should render without exploding', () => {
        expect(HeroCardComponent).toHaveLength(1);
    });

    it('should render when hero\'s wins are are null', () => {
        hero.stats.wins = null;
        HeroCardComponent = getHeroCardComponent(user, hero, group);
        expect(HeroCardComponent).toHaveLength(1);
    });

    it('should render when hero\'s loss are are null', () => {
        hero.stats.losses = null;
        HeroCardComponent = getHeroCardComponent(user, hero, group);
        expect(HeroCardComponent).toHaveLength(1);
    });

    it('should not set invitable class when hero belongs to user', () => {
        expect(user.platformDisplayName).toEqual(hero.platformDisplayName);
        expect(HeroCardComponent.find('.invitable')).toHaveLength(0);
    });

    it('should set invitable class to true when hero does not belong to user', () => {
        user.platformDisplayName = "Luckybomb#1470";
        HeroCardComponent = getHeroCardComponent(user, hero, group);
        expect(user.platformDisplayName).not.toEqual(hero.platformDisplayName);
        expect(HeroCardComponent.find('.invitable')).toHaveLength(1);
    });

    const containsHero = (members, hero) => {
        return members.map((member) => {
            return member.platformDisplayName
        }).indexOf(hero.platformDisplayName) > -1;
    }

    it('should not set invitable class when hero is already a member in user\'s group', () => {
        hero = group.members[0];
        expect(containsHero(group.members, hero)).toBe(true);
        HeroCardComponent = getHeroCardComponent(user, hero, group);
        expect(HeroCardComponent.find('.invitable')).toHaveLength(0);
    });

    it('should not set invitable class when hero is already a pending member in user\'s group', () => {
        hero = group.pending[0];
        expect(containsHero(group.pending, hero)).toBe(true);
        HeroCardComponent = getHeroCardComponent(user, hero, group);
        expect(HeroCardComponent.find('.invitable')).toHaveLength(0);
    });

    it('should call model invite player when when the plus-container div is clicked', () => {
        Model.inviteUserToGroup = jest.fn();
        HeroCardComponent.find('.plus-container').simulate('click');
        expect(Model.inviteUserToGroup).toHaveBeenCalledWith({
            platformDisplayName: hero.platformDisplayName,
            heroName: hero.heroName
        });
    });
});