import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import HeroImages from './HeroImages';

const names = require('../../../../../shared/allHeroNames').names;

describe('HeroCard Component',()=> {
    it('should render without exploding', () => {
        const wrapper = mount(
            <HeroImages heroNames={[names[0], names[1], names[2]]}/>
        );

        const HeroCardComponent = wrapper.find(HeroImages);
        expect(HeroCardComponent).toBeTruthy();
    });

    it('should match the snapshot', () => {
        let component = renderer.create(
            <HeroImages heroNames={[names[0], names[1], names[2]]}/>
        );

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});