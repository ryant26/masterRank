import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';

import HeroStatsList from './HeroStatsList';
import HeroStatsListItem from 'components/Stats/HeroStatsListItem/HeroStatsListItem';
import { users } from 'resources/users';
import { getHeroes } from 'resources/heroes';

const mockStore = configureStore();
const shallowHeroStatsList = (heroes, groupLeader='', showPlatformDisplayName=false, isPending=false) => {
    return shallow(
        <HeroStatsList
            heroes={heroes}
            groupLeader={groupLeader}
            showPlatformDisplayName={showPlatformDisplayName}
            isPending={isPending}
        />
    );
};

describe('HeroStatsList Component', () => {
    const heroes = getHeroes();
    const groupLeader = heroes[0].platformDisplayName;
    let wrapper;

    beforeEach(() => {
        wrapper = shallowHeroStatsList(heroes);
    });

    it('should match the snapshot', () => {
        let store = mockStore({
            user: users[0]
        });
        let component = renderer.create(
            <Provider store={store}>
                <HeroStatsList heroes={getHeroes()}/>
            </Provider>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should render without exploding', () => {
        expect(wrapper.find(HeroStatsList)).toBeTruthy();
    });

    it('should have a hero card for every hero passed', () => {
        expect(wrapper.find(HeroStatsListItem)).toHaveLength(4);
    });

    it('should show the heroStatsListItems in the order of preference', () => {
        let statsCards = wrapper.find(HeroStatsListItem);
        expect(statsCards.length).toBeGreaterThan(0);
        statsCards.forEach((image, i) => {
            let cardHeroName = image.props().hero.heroName;
            let heroName = heroes[i].heroName;

            expect(cardHeroName).toEqual(heroName);
        });
    });

    it('should set showPlatformDisplayName prop to false by default', () => {
        expect(wrapper.find(HeroStatsListItem).first().props().showPlatformDisplayName).toBeFalsy();
    });

    it('should set showPlatformDisplayName prop to true when passed in as true', () => {
        wrapper = shallowHeroStatsList(heroes, groupLeader, true);
        expect(wrapper.find(HeroStatsListItem).first().props().showPlatformDisplayName).toBeTruthy();
    });

    it('should set isLeader prop to true when hero belongs to group leader', () => {
        wrapper = shallowHeroStatsList(heroes, groupLeader);
        expect(wrapper.find(HeroStatsListItem).first().props().hero.platformDisplayName).toBe(groupLeader);
        expect(wrapper.find(HeroStatsListItem).first().props().isLeader).toBe(true);
    });

    it('should set isLeader prop to false when hero does not belongs to group leader', () => {
        expect(wrapper.find(HeroStatsListItem).first().props().hero.platformDisplayNam).not.toBe(heroes[0].platformDisplayName);
        expect(wrapper.find(HeroStatsListItem).first().props().isLeader).toBe(false);
    });

    it('should set hero stats list item isPending prop to false by default', () => {
        expect(wrapper.find(HeroStatsListItem).first().props().isPending).toBeFalsy();
    });

    it('should set hero stats list item isPending prop to true when true is given', () => {
        let isPending = true;
        wrapper = shallowHeroStatsList(heroes, groupLeader, false, isPending);
        expect(wrapper.find(HeroStatsListItem).first().props().isPending).toBeTruthy();
    });
});
