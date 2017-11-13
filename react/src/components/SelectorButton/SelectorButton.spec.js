import React from 'react';
import { mount } from 'enzyme';

import SelectorButton from './SelectorButton';
import HeroImage from '../HeroImage/HeroImage';

describe('SelectorButton Component',()=> {
    it('should render without exploding', () => {
        const wrapper = mount(
            <SelectorButton heroName="orisa"/>
        );

        const SelectorButtonComponent = wrapper.find(SelectorButton);
        const HeroImageComponent = SelectorButtonComponent.find(HeroImage);

        expect(SelectorButtonComponent.length).toBeTruthy();
        expect(HeroImageComponent.length).toBeTruthy();
    });
});