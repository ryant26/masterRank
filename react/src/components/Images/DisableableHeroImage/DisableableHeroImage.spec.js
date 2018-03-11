import React from 'react';
import { shallow } from 'enzyme';

import DisableableHeroImage from './DisableableHeroImage';
import HeroImage from 'components/Images/HeroImage/HeroImage';

import HEROES from 'resources/heroes';

const shallowDisableableHeroImage= (heroName, onClick, disabled) => {
    return shallow(
        <DisableableHeroImage heroName={heroName} disabled={disabled} onClick={onClick}/>
    );
};

describe('HeroImage',()=> {
    const heroName = HEROES[0].heroName;
    const onClick = jest.fn();
    let wrapper;

    beforeEach(() => {
        wrapper = shallowDisableableHeroImage(heroName, onClick);
    });

    it('should render', () => {
        expect(wrapper).toHaveLength(1);
    });

    it('should mount HeroImage with correct props', () => {
        expect(wrapper.find(HeroImage)).toHaveLength(1);
        expect(wrapper.find(HeroImage).props().heroName).toBe(heroName);
        expect(wrapper.find(HeroImage).props().onClick).toBe(onClick);
    });

    it('should have className DisableableHeroImage', () => {
        expect(wrapper.find('.DisableableHeroImage')).toHaveLength(1);
    });

    it('should not have class disabled when disabled is false', () => {
        expect(wrapper.find('.disabled')).toHaveLength(0);
    });

    it('should have class disabled when disabled is true', () => {
        wrapper.setProps({
            disabled: true
        });
        expect(wrapper.find('.disabled')).toHaveLength(1);
    });
});