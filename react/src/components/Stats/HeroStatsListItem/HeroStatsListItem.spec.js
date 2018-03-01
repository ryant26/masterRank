import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';

import HeroStatsListItem from './HeroStatsListItem';
import RecordStat from './RecordStat';
import HeroStat from './HeroStat';

import { users } from '../../../resources/users';
import { getHeroes } from '../../../resources/heroes';

const mockStore = configureStore();

const shallowHeroStatsListItem = (user, hero, isLeader, showPlatformDisplayName) => {
    let store = mockStore({
        user
    });
    return shallow(
        <HeroStatsListItem
            store={store}
            hero={hero}
            isLeader={isLeader}
            showPlatformDisplayName={showPlatformDisplayName}
        />
    );
};

const renderHeroStatsListItem  = (user, hero) => {
    let store = mockStore({
        user
    });
    return renderer.create(
        <HeroStatsListItem store={store} hero={hero}/>
    );
};

const capitalizeFirstLetterOf = (heroName) => {
    return heroName[0].toUpperCase() + heroName.slice(1);
};

describe('HeroStatsListItem', () => {
    const user = users[0];
    let wrapper;
    let hero;

    beforeEach(() => {
        hero = getHeroes()[0];
        wrapper = shallowHeroStatsListItem(user, hero);
    });

    it('should render without exploding', () => {
        expect(wrapper.dive().find(HeroStatsListItem)).toBeTruthy();
    });

    describe('when hero has stats', () => {

        it('should have 3 record stats', () => {
            let recordStats = wrapper.dive().find(RecordStat);

            expect(recordStats.length).toEqual(3);
            expect(recordStats.map((stat) => stat.props().statName)).toEqual(['wins', 'losses', 'k/d']);
        });

        it('should have 6 hero stats', () => {
            let recordStats = wrapper.dive().find(HeroStat);

            expect(recordStats.length).toEqual(6);
            expect(recordStats.map((stat) => stat.props().statName)).toEqual(['damage', 'healing', 'blocked', 'obj. kills', 'obj. time', 'accuracy']);
        });

        it('should show the leader icon when leader is set', () => {
            const isLeader = true;
            wrapper = shallowHeroStatsListItem(user, hero, isLeader);
            expect(wrapper.props().isLeader).toBeDefined();
            expect(wrapper.dive().find('.crown').length).toEqual(1);
        });

        it('should not show the leader icon when leader is cleared', () => {
            expect(wrapper.props().isLeader).not.toBeDefined();
            expect(wrapper.dive().find('.crown').length).toEqual(0);
        });

        describe('when show platform display name prop is set', () => {
            const showPlatformDisplayName = true;

            it('and hero does not belong to user should show the platformDisplayName - heroName', () => {
                hero.platformDisplayName = "not" + user.platformDisplayName;
                wrapper = shallowHeroStatsListItem(user, hero, false, showPlatformDisplayName);
                expect(wrapper.props().showPlatformDisplayName).toBeDefined();
                const heroName = capitalizeFirstLetterOf(hero.heroName);

                expect(wrapper.dive().find('h3').text()).toEqual(`${hero.platformDisplayName} - ${heroName}`);
            });

            it('and hero belong to user should show You - heroName', () => {
                wrapper = shallowHeroStatsListItem(user, hero, false, showPlatformDisplayName);
                expect(wrapper.props().showPlatformDisplayName).toBeDefined();
                const heroName = capitalizeFirstLetterOf(hero.heroName);

                expect(wrapper.dive().find('h3').text()).toEqual(`You - ${heroName}`);
            });
        });

        it('should not show the platformDisplayName when show platform display name prop is cleared', () => {
            expect(wrapper.props().showPlatformDisplayName).not.toBeDefined();
            expect(wrapper.dive().find('h3').text()).toEqual(capitalizeFirstLetterOf(hero.heroName));
        });
    });

    describe('when hero has no stats', () => {

        beforeEach(() => {
            hero = getHeroes()[0];
            hero.stats = null;
            shallowHeroStatsListItem(user, hero);
        });

        it('should have 3 record stats', () => {
            let recordStats = wrapper.dive().find(RecordStat);

            expect(recordStats.length).toEqual(3);
            expect(recordStats.map((stat) => stat.props().statName)).toEqual(['wins', 'losses', 'k/d']);
        });

        it('should have 6 hero stats', () => {
            let recordStats = wrapper.dive().find(HeroStat);

            expect(recordStats.length).toEqual(6);
            expect(recordStats.map((stat) => stat.props().statName)).toEqual(['damage', 'healing', 'blocked', 'obj. kills', 'obj. time', 'accuracy']);
        });

        it('should show the leader icon when leader is set', () => {
            const isLeader = true;
            wrapper = shallowHeroStatsListItem(user, hero, isLeader, undefined);
            expect(wrapper.props().isLeader).toBeDefined();
            expect(wrapper.dive().find('.crown').length).toEqual(1);
        });

        it('should not show the leader icon when leader is cleared', () => {
            expect(wrapper.props().isLeader).not.toBeDefined();
            expect(wrapper.dive().find('.crown').length).toEqual(0);
        });

        describe('when show platform display name prop is set', () => {
            const showPlatformDisplayName = true;

            it('and hero does not belong to user should show the platformDisplayName - heroName', () => {
                hero.platformDisplayName = "not" + user.platformDisplayName;
                wrapper = shallowHeroStatsListItem(user, hero, false, showPlatformDisplayName);
                expect(wrapper.props().showPlatformDisplayName).toBeDefined();
                const heroName = capitalizeFirstLetterOf(hero.heroName);

                expect(wrapper.dive().find('h3').text()).toEqual(`${hero.platformDisplayName} - ${heroName}`);
            });

            it('and hero belong to user should show You - heroName', () => {
                wrapper = shallowHeroStatsListItem(user, hero, false, showPlatformDisplayName);
                expect(wrapper.props().showPlatformDisplayName).toBeDefined();
                const heroName = capitalizeFirstLetterOf(hero.heroName);

                expect(wrapper.dive().find('h3').text()).toEqual(`You - ${heroName}`);
            });
        });

        it('should not show the platformDisplayName when prop is not set', () => {
            expect(wrapper.props().showPlatformDisplayName).not.toBeDefined();
            expect(wrapper.dive().find('h3').text()).toEqual(capitalizeFirstLetterOf(hero.heroName));
        });
    });

    describe('snapshots should match', () => {
        it('when hero stats are defined', () => {
            let componentWithStats = renderHeroStatsListItem(user, hero);

            let tree = componentWithStats.toJSON();
            expect(tree).toMatchSnapshot();
        });

        it('when hero stats are null', () => {
            hero.stats = null;
            let componentWithoutStats = renderHeroStatsListItem(user, hero);

            let tree = componentWithoutStats.toJSON();
            expect(tree).toMatchSnapshot();
        });
    });
});