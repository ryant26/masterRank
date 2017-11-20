import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import HeroRolesContainer from './HeroRolesContainer';

const mockStore = configureStore();

describe('Hero Roles Container', () => {
    let wrapper;

    let getHeroConfig = function(heroName) {
        return {
            heroName,
            wins: 1,
            losses: 2,
            platformDisplayName: 'PwNShoPP#1662',
            hoursPlayed: 3
        };
    };

    beforeEach(() => {
        const testState = {
            "heroes": [
                getHeroConfig('orisa'),
                getHeroConfig('soldier76'),
                getHeroConfig('mercy'),
                getHeroConfig('hanzo'),
                getHeroConfig('reinhardt')
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
                    getHeroConfig('soldier76')
                ]
            )
        );
    });
    it('should render defense characters in the correct HeroRole Component', () => {
        const HeroRolesComponent = wrapper.find("[role='defense']");
        expect(JSON.stringify(HeroRolesComponent.props().heroes)).toBe(
            JSON.stringify(
                [
                    getHeroConfig('hanzo')
                ]
            )
        );
        
    });
    it('should render tank characters in the correct HeroRole Component', () => {
        const HeroRolesComponent = wrapper.find("[role='tank']");
        expect(JSON.stringify(HeroRolesComponent.props().heroes)).toBe(
            JSON.stringify(
                [
                  getHeroConfig('orisa'),
                  getHeroConfig('reinhardt'),
                ]
            )
        );
    });
    it('should render support characters in the correct HeroRole Component', () => {
        const HeroRolesComponent = wrapper.find("[role='support']");
        expect(JSON.stringify(HeroRolesComponent.props().heroes)).toBe(
            JSON.stringify(
                [
                  getHeroConfig('mercy')
                ]
            )
        );
    });
});