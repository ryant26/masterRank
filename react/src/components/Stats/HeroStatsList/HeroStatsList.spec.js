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

    it('should show the empty message when no stats can be shown', () => {
        const msg = 'empty message';
        wrapper = mount(
            <HeroStatsList emptyMessage={msg} heroes={[]}/>
        );

        expect(wrapper.find('.sub-title').text()).toEqual(msg);
    });

    it('should show a default message when none is passed', () => {
        const msg = 'empty message';
        wrapper = mount(
            <HeroStatsList emptyMessage={msg} heroes={[]}/>
        );

        expect(wrapper.find('.sub-title').length).toBeTruthy();
    });

    it('should pass platformDisplayName prop down to list item', () => {
        wrapper = mount(
            <HeroStatsList showPlatformDisplayName={true} heroes={getHeroes()}/>
        );

        expect(wrapper.find(HeroStatsListItem).first().props().showPlatformDisplayName).toBeTruthy();

        wrapper = mount(
            <HeroStatsList showPlatformDisplayName={false} heroes={getHeroes()}/>
        );

        expect(wrapper.find(HeroStatsListItem).first().props().showPlatformDisplayName).toBeFalsy();
    });

    it('should pass the proper isLeader prop to list item', () => {
        let heroes = getHeroes();
        wrapper = mount(
            <HeroStatsList groupLeader={heroes[0].platformDisplayName} heroes={heroes}/>
        );

        expect(wrapper.find(HeroStatsListItem).first().props().isLeader).toBeTruthy();

        wrapper = mount(
            <HeroStatsList groupLeader={'notTheRightName'} heroes={heroes}/>
        );

        expect(wrapper.find(HeroStatsListItem).first().props().isLeader).toBeFalsy();

    });
});
