import React from 'react';
import { shallow } from 'enzyme';

import HeroImage from './HeroImage';

import HEROES from '../../resources/heroes';

const shallowHeroImage = (heroName, onClick, isPending) => {
    return shallow(
        <HeroImage heroName={heroName} isPending={isPending} onClick={onClick}/>
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

    it('should not have class pending when isPending is false', () => {
        expect(wrapper.find('.pending')).toHaveLength(0);
    });

    it('should have class pending when isPending is true', () => {
        wrapper.setProps({
            isPending: true
        });
        expect(wrapper.find('.pending')).toHaveLength(1);
    });

    it('should call onClick prop when img is clicked', () => {
        wrapper.find('.HeroImage').simulate('click');
        expect(onClick).toHaveBeenCalled();
    });
});