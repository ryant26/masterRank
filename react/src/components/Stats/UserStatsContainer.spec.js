import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import {getHeroes} from '../../resources/heroes';
import UserStatsContainer from './UserStatsContainer';
import {createStore} from "../../model/store";
import {addHero} from "../../actionCreators/hero";


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

describe('UserStatsContainer Component', () => {
    let wrapper;
    let hero;

    beforeEach(() => {
        const heroes = getMixedHeroes();
        hero = {
            platformDisplayName: heroes[1].platformDisplayName,
            skillRating: heroes[1].skillRating
        };
        wrapper = mount(
            <UserStatsContainer store={getStore()} hero={hero} invitable={false}/>
        );
    });

    it('should render without exploding', () => {
        let wrapper = mount(
            <UserStatsContainer store={getStore()} hero={hero} invitable={false}/>
        );

        expect(wrapper.find(UserStatsContainer)).toBeTruthy();
    });

    it('should match the snapshot', () => {
        let component = renderer.create(
            <UserStatsContainer store={getStore()} hero={hero} invitable={true}/>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should have all the hero images for the users heroes', () => {
        let heroImages = wrapper.find('.HeroImages').children();

        expect(heroImages.length).toEqual(3);
    });

    it('should show the hero images in the order of preference', () => {
        let heroImages = wrapper.find('.HeroImages').children();
        let heroes = getHeroes();

        expect(heroImages.length).toBeGreaterThan(0);

        heroImages.forEach((image, i) => {
            let imageName = image.props().heroName;
            let heroName = heroes[i+1].heroName;

            expect(imageName).toEqual(heroName);
        });
    });
});