import React from 'react';
import { shallow } from 'enzyme';

import HeroImage from './HeroImage';

import HEROES from '../../resources/heroes';

const shallowHeroImage = (heroName, onClick, disabled) => {
    return shallow(
        <HeroImage heroName={heroName} disabled={disabled} onClick={onClick}/>
    );
};

describe('HeroImage',()=> {
    const heroName = HEROES[0].heroName;
    const onClick = jest.fn();
    let wrapper;

    beforeEach(() => {
        wrapper = shallowHeroImage(heroName, onClick);
    });

    it('should render', () => {
        expect(wrapper).toHaveLength(1);
    });

    it('should have className HeroImage', () => {
        expect(wrapper.find('.HeroImage')).toHaveLength(1);
    });

    it('should set alt prop to "heroName icon"', () => {
        expect(wrapper.find('.HeroImage').props().alt).toBe(`${heroName} icon`);
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

    it('should call onClick prop when img is clicked', () => {
        wrapper.find('.HeroImage').simulate('click');
        expect(onClick).toHaveBeenCalled();
    });
});