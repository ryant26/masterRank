import React from 'react';
import { mount, shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import HEROS from '../../resources/heroes';

import HeroCard from './HeroCard';

describe('HeroCard Component',()=> {
    let getHeroConfig = function() {
        return HEROS[0];
    };

    it('should render without exploding', () => {
        const wrapper = mount(
            <HeroCard hero={getHeroConfig()}/>
        );

        const HeroCardComponent = wrapper.find(HeroCard);
        expect(HeroCardComponent).toBeTruthy();
    });

    it('should toggle the stats card on click', () => {
        const component = renderer.create(
            <HeroCard hero={getHeroConfig()}/>
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