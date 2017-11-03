import React from 'react';
import { mount } from 'enzyme';
import { createRenderer } from 'react-test-renderer/shallow';
import HeroImage from './HeroImage';


const setup = propOverrides => {
    const props = Object.assign({
        heroName: 'orisa',        
    }, propOverrides);

    const renderer = createRenderer();
    renderer.render(<HeroImage {...props}/>);
    const output = renderer.getRenderOutput();

    return {
        props: props,
        output: output
    };
};

describe('HeroImage Component',()=> {
    it('should render without exploding', () => {
        const wrapper = mount(
            <HeroImage heroName="orisia" /> 
        );

        const HeroImageComponent = wrapper.find(HeroImage);
        expect(HeroImageComponent).toBeTruthy();
    });

    it('should render alt text with correct hero name', () => {
        const { output } = setup();
        expect(output.props.alt).toBe('orisa icon');
    });
});