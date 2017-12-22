import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import HeroSelector from '../HeroSelector/HeroSelector';
import HeroButton from './HeroButton/HeroButton';

let renderComponent = (selectedHeroes=[]) => {
    return renderer.create(
        <HeroSelector selectedHeroes={selectedHeroes} onHeroSelected={() => {}}/>
    );
};

describe('HeroSelector Component',()=> {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(
            <HeroSelector selectedHeroes={[]} onHeroSelected={() => {}}/>
        );
    });

    it('should render without exploding', () => {
        const HeroSelectorComponent = wrapper.find(HeroSelector);
        const SelectorButtonComponent = HeroSelectorComponent.find(HeroButton);
        expect(HeroSelectorComponent).toBeTruthy();
        expect(SelectorButtonComponent).toBeTruthy();
    });

    it('should render with the correct format without any selected heroes', () => {
        let component = renderComponent();
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should render with the correct format with selected heroes', () => {
        let component = renderComponent(['ana', 'phara', 'soldier76', 'widowmaker']);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should add the selected class to selected HeroButtons', () => {
        expect(wrapper.find(".HeroButton").at(0).hasClass('selected')).toBeFalsy();

        wrapper = mount(
            <HeroSelector selectedHeroes={['ana']} onHeroSelected={() => {}}/>
        );
        expect(wrapper.find(".HeroButton").at(0).hasClass('selected')).toBeTruthy();
    });

    it('should call the onHeroSelected function when a hero is clicked', () => {
        let func = jest.fn();
        wrapper = mount(
            <HeroSelector selectedHeroes={[]} onHeroSelected={func}/>
        );
        wrapper.find(HeroButton).at(0).simulate('click');
        expect(func).toHaveBeenCalledWith('ana');
    });
});