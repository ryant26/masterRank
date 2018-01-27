import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import {getHeroes} from '../../../../resources/heroes';
import HeroStatsList from './HeroStatsList';
import {createStore} from "../../../../model/store";
import {addHero} from "../../../../actions/hero";


const getMixedHeroes = () => {
    const heroes = getHeroes();
    heroes[0].platformDisplayName = 'notMyName';
    heroes[1].stats = undefined;
    return heroes;
};

const getStore = (heroes=getMixedHeroes()) => {
    let store = createStore();
    heroes.forEach((hero) => store.dispatch(addHero(hero)));
    return store;
};

describe('HeroStatsList Component', () => {
    let wrapper;
    let hero;

    beforeEach(() => {
        const heroes = getMixedHeroes();
        hero = {
            platformDisplayName: heroes[1].platformDisplayName,
            skillRating: heroes[1].skillRating
        };
        wrapper = mount(
            <HeroStatsList store={getStore()} hero={hero}/>
        );
    });

    it('should render without exploding', () => {
        let wrapper = mount(
            <HeroStatsList store={getStore()} hero={hero}/>
        );

        expect(wrapper.find(HeroStatsList)).toBeTruthy();
    });

    it('should match the snapshot', () => {
        let component = renderer.create(
            <HeroStatsList store={getStore()} hero={hero}/>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should have all the hero images for the users heroes', () => {
        let heroImages = wrapper.find('.preferredHeroIcons').children();

        expect(heroImages.length).toEqual(3);
    });

    it('should show the hero images in the order of preference', () => {
        let heroImages = wrapper.find('.preferredHeroIcons').children();
        let heroes = getHeroes();

        expect(heroImages.length).toBeGreaterThan(0);

        heroImages.forEach((image, i) => {
            let imageName = image.props().heroName;
            let heroName = heroes[i+1].heroName;

            expect(imageName).toEqual(heroName);
        });
    });

    it('should have a hero card for every user hero with stats', () => {
        let heroImages = wrapper.find('.body').children();

        expect(heroImages.length).toEqual(2);
    });

    it('should show the heroStatsListItems in the order of preference', () => {
        let statsCards = wrapper.find('.body').children();
        let heroes = getHeroes();

        expect(statsCards.length).toBeGreaterThan(0);

        statsCards.forEach((image, i) => {
            let cardHeroName = image.props().hero.heroName;
            let heroName = heroes[i+2].heroName;

            expect(cardHeroName).toEqual(heroName);
        });
    });
});