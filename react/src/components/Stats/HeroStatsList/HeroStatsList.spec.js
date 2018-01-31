import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import {getHeroes} from '../../../resources/heroes';
import HeroStatsList from './HeroStatsList';
import HeroStatsListItem from '../HeroStatsListItem/HeroStatsListItem';

describe('HeroStatsList Component', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(
            <HeroStatsList heroes={getHeroes()}/>
        );
    });

    it('should render without exploding', () => {
        let wrapper = mount(
            <HeroStatsList heroes={getHeroes()}/>
        );

        expect(wrapper.find(HeroStatsList)).toBeTruthy();
    });

    it('should match the snapshot', () => {
        let component = renderer.create(
            <HeroStatsList heroes={getHeroes()}/>
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
});
