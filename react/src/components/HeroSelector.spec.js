import React from 'react';
import { mount } from 'enzyme';
import HeroSelector from './HeroSelector';
import SelectorButton from './SelectorButton';

describe('HeroSelector Component',()=> {
    it('should render without exploding', () => {
        const wrapper = mount(
            <HeroSelector />
        );

        const HeroSelectorComponent = wrapper.find(HeroSelector);
        const SelectorButtonComponent = wrapper.find(HeroSelectorComponent);
        expect(HeroSelectorComponent).toBeTruthy();
        expect(SelectorButtonComponent).toBeTruthy();
    });

});