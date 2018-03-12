import React from 'react';
import { shallow } from 'enzyme';

import HeroImages from 'components/Stats/HeroImages/HeroImages';
import DisableableHeroImage from 'components/Images/DisableableHeroImage/DisableableHeroImage';
import HeroImage from 'components/Images/HeroImage/HeroImage';

const shallowHeroImages = (heroNames, disabled) => {
    return shallow(
        <HeroImages heroNames={heroNames} disabled={disabled}/>
    );
};

describe('HeroImages', ()=> {
    const heroNames = ['tracer', 'genji', 'phara'];
    let wrapper;

    beforeEach(() => {
        wrapper = shallowHeroImages(heroNames);
    });

    it('should render', () => {
        expect(wrapper).toHaveLength(1);
    });

    it('should render a HeroImage in order for each hero name passed in props', () => {
        expect(wrapper.find(HeroImage)).toHaveLength(heroNames.length);
        heroNames.forEach((heroName, i) => {
            expect(wrapper.find(HeroImage).at(i).props().heroName).toBe(heroName);
        });
    });

    it('should render a DisableableHeroImage in order for each hero name passed in props that is disabled', () => {
        const disabled = [false, true, true];
        wrapper = shallowHeroImages(heroNames, disabled);
        expect(wrapper.find(HeroImage)).toHaveLength(1);
        expect(wrapper.find(DisableableHeroImage)).toHaveLength(2);

        expect(wrapper.find(HeroImage).at(0).props().heroName).toBe(heroNames[0]);
        expect(wrapper.find(DisableableHeroImage).at(0).props().heroName).toBe(heroNames[1]);
        expect(wrapper.find(DisableableHeroImage).at(1).props().heroName).toBe(heroNames[2]);
    });
});