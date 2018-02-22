import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import Model from '../../../../../model/model';
import HeroCard from './HeroCard';
import Modal from '../../../../Modal/Modal';
import UserStatsContainer from '../../../../Stats/UserStatsContainer';
import { inviteNotification } from '../../../../Notifications/Notifications';
jest.mock('../../../../Notifications/Notifications');

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

    const containsHero = (members, hero) => {
        let result = members.find((member) => {
            return member.platformDisplayName === hero.platformDisplayName;
        });

        if (result) return true;
        return false;
    };

    let HeroCardComponent;
    const group = groupInvites[0];
    let user;
    let hero;

    beforeEach(() => {
        user = Object.create(users[0]);
        hero = Object.create(heroes[0]);
        HeroCardComponent = getHeroCardComponent(user, hero, group);
    });

    it('should render without exploding', () => {
        expect(HeroCardComponent).toHaveLength(1);
    });

    it('should handle when hero\'s stats object is null', () => {
        hero.stats = null;
        HeroCardComponent = getHeroCardComponent(user, hero, group);
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

    describe("when the heroCard's plus icon is clicked", () => {

        beforeEach(() => {
            Model.inviteUserToGroup = jest.fn();
            HeroCardComponent.find('.plus-container').simulate('click');
        });

        it('should call model invite player', () => {
            expect(Model.inviteUserToGroup).toHaveBeenCalledWith({
                platformDisplayName: hero.platformDisplayName,
                heroName: hero.heroName
            });
        });

        it('should send invite notification with correct display name', () => {
            expect(inviteNotification).toHaveBeenCalledWith(hero.platformDisplayName);
        });
    });

    it('should render Modal', () => {
        expect(HeroCardComponent.find(Modal)).toHaveLength(1);
    });

    describe('UserStatsContainer', () => {

        it('should render', () => {
            expect(HeroCardComponent.find(UserStatsContainer)).toHaveLength(1);
        });

        it('should pass hero to props', () => {
            expect(HeroCardComponent.find(UserStatsContainer).props().hero).toBe(hero);
        });

        it('should pass invitable to props', () => {
            expect(HeroCardComponent.find('.invitable')).toHaveLength(0);
            expect(HeroCardComponent.find(UserStatsContainer).props().invitable).toBe(false);
        });

        it('should pass toggleModal to props', () => {
            expect(HeroCardComponent.find(UserStatsContainer).props().toggleModal)
                .toBe(HeroCardComponent.instance().toggleModal);
        });
    });

});