import React from 'react';
import { mount } from 'enzyme';

import HeroSelector from '../HeroSelector/HeroSelector';
import SelectorButton from '../SelectorButton/SelectorButton';

describe('HeroSelector Component',()=> {
    it('should render without exploding', () => {
        const wrapper = mount(
            <HeroSelector />
        );

        const HeroSelectorComponent = wrapper.find(HeroSelector);
        const SelectorButtonComponent = HeroSelectorComponent.find(SelectorButton);
        expect(HeroSelectorComponent).toBeTruthy();
        expect(SelectorButtonComponent).toBeTruthy();
    });

});