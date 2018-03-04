import React from 'react';
import { mount } from 'enzyme';

import SelectorButton from './HeroButton';
import HeroImage from '../../../../Images/HeroImage/HeroImage';

describe('HeroButton Component',()=> {
    it('should render without exploding', () => {
        const wrapper = mount(
            <SelectorButton heroName="orisa" selected={false}/>
        );

        const SelectorButtonComponent = wrapper.find(SelectorButton);
        const HeroImageComponent = SelectorButtonComponent.find(HeroImage);

        expect(SelectorButtonComponent.length).toBeTruthy();
        expect(HeroImageComponent.length).toBeTruthy();
    });
});