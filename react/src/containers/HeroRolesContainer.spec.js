import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import HeroRolesContainer from './HeroRolesContainer';

const mockStore = configureStore();

describe('Hero Roles Container', () => {
    let wrapper;
    beforeEach(() => {
        const testState = {
            "heroes": [
                {heroName: 'orisa'},
                {heroName: 'soldier76'},
                {heroName: 'mercy'},
                {heroName: 'hanzo'},
                {heroName: 'reinhardt'}
            ]
        };
        const store = mockStore(testState);
        wrapper = mount(<HeroRolesContainer store={store}/>);
    });

    it ('should render without exploding', () => {
        const HeroRolesContainerComponent = wrapper.find(HeroRolesContainer);
        expect(HeroRolesContainerComponent.length).toBeTruthy();
    });

    it('should render offense characters in the correct HeroRole Component', () => {        
        const HeroRolesComponent = wrapper.find("[role='offense']");
        expect(JSON.stringify(HeroRolesComponent.props().heroes)).toBe(
            JSON.stringify(
                [
                    {heroName: 'soldier76'}
                ]
            )
        );
    });
    it('should render defense characters in the correct HeroRole Component', () => {
        const HeroRolesComponent = wrapper.find("[role='defense']");
        expect(JSON.stringify(HeroRolesComponent.props().heroes)).toBe(
            JSON.stringify(
                [
                    {heroName: 'hanzo'}
                ]
            )
        );
        
    });
    it('should render tank characters in the correct HeroRole Component', () => {
        const HeroRolesComponent = wrapper.find("[role='tank']");
        expect(JSON.stringify(HeroRolesComponent.props().heroes)).toBe(
            JSON.stringify(
                [
                    {heroName: 'orisa'},
                    {heroName: 'reinhardt'},
                ]
            )
        );
    });
    it('should render support characters in the correct HeroRole Component', () => {
        const HeroRolesComponent = wrapper.find("[role='support']");
        expect(JSON.stringify(HeroRolesComponent.props().heroes)).toBe(
            JSON.stringify(
                [
                    {heroName: 'mercy'}
                ]
            )
        );
    });
});