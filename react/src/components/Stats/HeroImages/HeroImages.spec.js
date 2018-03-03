import React from 'react';
import { shallow } from 'enzyme';

import HeroImages from './HeroImages';
import HeroImage from '../../HeroImage/HeroImage';

const shallowHeroImages = (heroNames, disabled) => {
    return shallow(
        <HeroImages heroNames={heroNames} disabled={disabled}/>
    );
};

describe('HeroImages',()=> {
    const heroNames = ['tracer', 'genji', 'phara'];
    const disabled = [false, true, true];
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

    it('should set HeroImage disabled prop to true or false based on HeroImages disabled[index]', () => {
        wrapper = shallowHeroImages(heroNames, disabled);
        heroNames.forEach((heroName, i) => {
            expect(wrapper.find(HeroImage).at(i).props().disabled).toBe(disabled[i]);
        });
    });
});