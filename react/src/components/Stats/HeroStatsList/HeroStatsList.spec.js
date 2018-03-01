import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';

import HeroStatsList from './HeroStatsList';
import HeroStatsListItem from '../HeroStatsListItem/HeroStatsListItem';
import { users } from '../../../resources/users';
import { getHeroes } from '../../../resources/heroes';

const mockStore = configureStore();
describe('HeroStatsList Component', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <HeroStatsList heroes={getHeroes()}/>
        );
    });

    it('should render without exploding', () => {
        let wrapper = shallow(
            <HeroStatsList heroes={getHeroes()}/>
        );

        expect(wrapper.find(HeroStatsList)).toBeTruthy();
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

    it('should have a hero card for every hero passed', () => {
        let heroImages = wrapper.find(HeroStatsListItem);

        expect(heroImages.length).toEqual(4);
    });

    it('should show the heroStatsListItems in the order of preference', () => {
        let statsCards = wrapper.find(HeroStatsListItem);
        let heroes = getHeroes();

        expect(statsCards.length).toBeGreaterThan(0);

        statsCards.forEach((image, i) => {
            let cardHeroName = image.props().hero.heroName;
            let heroName = heroes[i].heroName;

            expect(cardHeroName).toEqual(heroName);
        });
    });

    it('should pass platformDisplayName prop down to list item', () => {
        wrapper = shallow(
            <HeroStatsList showPlatformDisplayName={true} heroes={getHeroes()}/>
        );

        expect(wrapper.find(HeroStatsListItem).first().props().showPlatformDisplayName).toBeTruthy();

        wrapper = shallow(
            <HeroStatsList showPlatformDisplayName={false} heroes={getHeroes()}/>
        );

        expect(wrapper.find(HeroStatsListItem).first().props().showPlatformDisplayName).toBeFalsy();
    });

    it('should pass the proper isLeader prop to list item', () => {
        let heroes = getHeroes();
        wrapper = shallow(
            <HeroStatsList groupLeader={heroes[0].platformDisplayName} heroes={heroes}/>
        );

        expect(wrapper.find(HeroStatsListItem).first().props().isLeader).toBeTruthy();

        wrapper = shallow(
            <HeroStatsList groupLeader={'notTheRightName'} heroes={heroes}/>
        );

        expect(wrapper.find(HeroStatsListItem).first().props().isLeader).toBeFalsy();

    });
});
