import React from 'react';
import { mount } from 'enzyme';

import HeroCard from './HeroCard';

describe('HeroCard Component',()=> {
    it('should render without exploding', () => {
        const wrapper = mount(
            <HeroCard hero={{
                general_stats: {
                    win_percentage: 'mock_percentage%'
                },
                heroName: 'orisa'
            }}/>
        );

        const HeroCardComponent = wrapper.find(HeroCard);
        expect(HeroCardComponent).toBeTruthy();
    });

    it('should toggle the style of the button when hovering', () => {
        // use simulate 
        // or some kind of onChange
    });

    it('should toggle the the stats card on click', () => {
        // use simulate here as well 
    });

    it('should render the username of the owner of that hero stats', () => {
        // future test: pass the username as props
    });
});