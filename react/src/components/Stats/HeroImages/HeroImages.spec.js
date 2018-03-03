import React from 'react';
import { shallow } from 'enzyme';

import HeroImages from './HeroImages';
import HeroImage from '../../HeroImage/HeroImage';

import HEROES from '../../../resources/heroes';

const shallowHeroImages = (heroNames, isPending) => {
    return shallow(
        <HeroImages heroNames={heroNames} isPending={isPending}/>
    );
};

describe('HeroImages',()=> {
    const heroNames = HEROES.map((hero) => hero.heroName);
    let wrapper;

    beforeEach(() => {
        wrapper = shallowHeroImages(heroNames);
    });

    it('should render', () => {
        expect(wrapper).toHaveLength(1);
    });

    it('should render a HeroImage for each hero name passed in props', () => {
        expect(wrapper.find(HeroImage)).toHaveLength(heroNames.length);
        heroNames.forEach((heroName, i) => {
            expect(wrapper.find(HeroImage).at(i).props().heroName).toBe(heroName);
        });
    });

    it('should set isPending to false by default', () => {
        heroNames.forEach((heroName, i) => {
            expect(wrapper.find(HeroImage).at(i).props().isPending).toBe(false);
        });
    });

    it('should set isPending to true when passed in as true', () => {
        wrapper = shallowHeroImages(heroNames, true);
        heroNames.forEach((heroName, i) => {
            expect(wrapper.find(HeroImage).at(i).props().isPending).toBe(true);
        });
    });
});