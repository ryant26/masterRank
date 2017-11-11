import React from 'react';
import { mount, shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import HeroCard from './HeroCard';

describe('HeroCard Component',()=> {
    it('should render without exploding', () => {
        const wrapper = mount(
            <HeroCard hero={
                {heroName: 'orisa'}
            }/>
        );

        const HeroCardComponent = wrapper.find(HeroCard);
        expect(HeroCardComponent).toBeTruthy();
    });

    it('should toggle the stats card on click', () => {
        const component = renderer.create(
            <HeroCard hero={{heroName: 'orisa'}}/>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        component.getInstance().toggleStats();  
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        component.getInstance().toggleStats();  
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();

    });
});