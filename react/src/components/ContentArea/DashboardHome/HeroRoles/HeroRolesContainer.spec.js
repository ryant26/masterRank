import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import HeroRolesContainer from './HeroRolesContainer';
import {createStore} from '../../../../model/store';
import {addHero} from '../../../../actions/hero';
import {addFilter} from '../../../../actions/heroFilters';
import {updateUser} from '../../../../actions/user';
import {users} from '../../../../resources/users';

const getHeroRolesContainer = (store) => {
    return mount(
        <Provider store={store}>
            <HeroRolesContainer/>
        </Provider>
    );
};

describe('Hero Roles Container', () => {
    let wrapper;
    let store;

    let getHeroConfig = function(heroName) {
        return {
            heroName,
            platformDisplayName: 'PwNShoPP#1662',
            skillRating: 2400,
            stats: {
                hoursPlayed: 3,
                wins: 2,
                losses: 1
            }
        };
    };

    beforeEach(() => {
        store = createStore();
        store.dispatch(addHero(getHeroConfig('soldier76')));
        store.dispatch(addHero(getHeroConfig('hanzo')));
        store.dispatch(addHero(getHeroConfig('orisa')));
        store.dispatch(addHero(getHeroConfig('reinhardt')));
        store.dispatch(addHero(getHeroConfig('mercy')));
        store.dispatch(updateUser(users[0]));
        wrapper = getHeroRolesContainer(store);
    });

    it ('should render without exploding', () => {
        const HeroRolesContainerComponent = wrapper.find(HeroRolesContainer);
        expect(HeroRolesContainerComponent.length).toBeTruthy();
    });

    it('should render offense characters in the correct HeroRole Component', () => {        
        const HeroRolesComponent = wrapper.find("[role='Offense']");
        expect(JSON.stringify(HeroRolesComponent.props().heroes)).toBe(
            JSON.stringify(
                [
                    getHeroConfig('soldier76')
                ]
            )
        );
    });

    it('should render defense characters in the correct HeroRole Component', () => {
        const HeroRolesComponent = wrapper.find("[role='Defense']");
        expect(JSON.stringify(HeroRolesComponent.props().heroes)).toBe(
            JSON.stringify(
                [
                    getHeroConfig('hanzo')
                ]
            )
        );
    });

    it('should render tank characters in the correct HeroRole Component', () => {
        const HeroRolesComponent = wrapper.find("[role='Tank']");
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
        const HeroRolesComponent = wrapper.find("[role='Support']");
        expect(JSON.stringify(HeroRolesComponent.props().heroes)).toBe(
            JSON.stringify(
                [
                  getHeroConfig('mercy')
                ]
            )
        );
    });

    it('should filter out characters when filters are enabled', () => {
        store.dispatch(addFilter('mccree'));
        wrapper = getHeroRolesContainer(store);
        const offensiveList = wrapper.find("[role='Offense']");
        expect(offensiveList.props().heroes.length).toBe(0);
    });

    it('should not filter heroes for other roles', () => {
        store.dispatch(addFilter('mccree'));
        wrapper = getHeroRolesContainer(store);
        const defensiveList = wrapper.find("[role='Defense']");
        expect(defensiveList.props().heroes.length).toBe(1);
    });
});