import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import HeroImages from './HeroImages';
import HeroImage from '../../HeroImage/HeroImage';

const names = require('../../../../../shared/libs/allHeroNames').names;


describe('HeroCard Component',()=> {
    const heroNames = [names[0], names[1], names[2]];
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <HeroImages heroNames={heroNames}/>
        );
    });

    it('should render without exploding', () => {
        expect(wrapper.find(HeroImages)).toBeTruthy();
    });

    it('should have a heroImage for each heroName', () => {
        expect(wrapper.find(HeroImage)).toHaveLength(heroNames.length);
    });

    it("should render heroImages in order", () => {
        heroNames.forEach((heroName, i) => {
            expect(wrapper.find(HeroImage).at(i).props().heroName).toBe(heroName);
        });
    });

    it('should match the snapshot', () => {
        let component = renderer.create(
            <HeroImages heroNames={heroNames}/>
        );

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});