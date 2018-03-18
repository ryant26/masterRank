import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import HeroRolesContainer from 'components/ContentArea/DashboardHome/HeroRoles/HeroRolesContainer';
import HeroList from 'components/ContentArea/DashboardHome/HeroRoles/HeroRolesList/HeroRolesList';

const mockStore = configureStore();

const shallowHeroRolesContainer = (heroes, heroFilters) => {
    let store = mockStore({
        heroes,
        heroFilters
    });

    return shallow(
        <HeroRolesContainer store={store}/>
    ).dive();
};

const getHeroConfig = function(heroName) {
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

describe('Hero Roles Container', () => {
    const offenseHeroes = [
        getHeroConfig('soldier76')
    ];
    const defenseHeroes = [
        getHeroConfig('hanzo')
    ];
    const tankHeroes = [
        getHeroConfig('orisa'),
        getHeroConfig('reinhardt')
    ];
    const supportHeroes = [
        getHeroConfig('mercy')
    ];
    const heroes = [
        ...offenseHeroes,
        ...defenseHeroes,
        ...tankHeroes,
        ...supportHeroes
    ];
    const noHeroFilters = [];
    let component;

    beforeEach(() => {
        component = shallowHeroRolesContainer(heroes, noHeroFilters);
    });

    it ('should render without exploding', () => {
        expect(component).toHaveLength(1);
    });

    it('should render offense characters in the correct HeroRole Component', () => {
        const offenseComponent= component.find(HeroList).at(0);
        expect(offenseComponent.props().role).toBe('Offense');
        expect(offenseComponent.props().heroes).toEqual(offenseHeroes);
    });

    it('should render defense characters in the correct HeroRole Component', () => {
        const defenseComponent= component.find(HeroList).at(1);
        expect(defenseComponent.props().role).toBe('Defense');
        expect(defenseComponent.props().heroes).toEqual(defenseHeroes);
    });

    it('should render tank characters in the correct HeroRole Component', () => {
        const tankComponent= component.find(HeroList).at(2);
        expect(tankComponent.props().role).toBe('Tank');
        expect(tankComponent.props().heroes).toEqual(tankHeroes);
    });

    it('should render support characters in the correct HeroRole Component', () => {
        const supportComponent= component.find(HeroList).at(3);
        expect(supportComponent.props().role).toBe('Support');
        expect(supportComponent.props().heroes).toEqual(supportHeroes);
    });

    describe('when hero filter is set to mccree and mccree is not in the offensive heroes list', () => {
        const heroFilter = ['mccree'];

        beforeEach(() => {
            component = shallowHeroRolesContainer(heroes, heroFilter);
        });

        it('should filter out all characters from offense role', () => {
            offenseHeroes.forEach((hero) => {
                expect(hero.heroName).not.toBe(heroFilter[0]);
            });
            const offenseComponent= component.find(HeroList).at(0);
            expect(offenseComponent.props().role).toBe('Offense');
            expect(offenseComponent.props().heroes.length).toBe(0);
        });

        it('should not filter out heroes for other roles', () => {
            const defenseComponent = component.find(HeroList).at(1);
            expect(defenseComponent.props().role).toBe('Defense');
            expect(defenseComponent.props().heroes.length).toBe(defenseHeroes.length);

            const tankComponent = component.find(HeroList).at(2);
            expect(tankComponent.props().role).toBe('Tank');
            expect(tankComponent.props().heroes.length).toBe(tankHeroes.length);

            const supportComponent = component.find(HeroList).at(3);
            expect(supportComponent.props().role).toBe('Support');
            expect(supportComponent.props().heroes.length).toBe(supportHeroes.length);
        });
    });

});