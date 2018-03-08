import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import AddHeroIcon from './AddHeroIcon';
import PreferredHeroSelector from './PreferredHeroSelector/PreferredHeroSelector';
import Model from '../../../model/model';
jest.mock('../../../model/model');

import PreferredHeroesContainer from './PreferredHeroesContainer';

const mockStore = configureStore();

const shallowPreferredHeroesContainer = (heroes) => {
    const store = mockStore({
        preferredHeroes: {
            heroes
        }
    });

    return shallow(
        <PreferredHeroesContainer store={store}/>
    ).dive();
};

//TODO: Add tests, I may do this when I take the story to match component.state with store.preferred.heroes.
//TODO: Test to verify the correct heroImage's are in the correct slots
describe('PreferredHeroesContainer', () => {
    let component;
    let componentInstance;

    const noPreferredHeroes = [];

    beforeEach(() => {
        component = shallowPreferredHeroesContainer(noPreferredHeroes);
        componentInstance = component.instance();
    });

    afterEach(() => {
        Model.updatePreferredHeroes.mockClear();
    });

    it('Should render without exploding', () => {
        expect(component).toHaveLength(1);
    });

    it('Should open the modal when a slot is clicked', function() {
        expect(component.state().modalOpen).toBe(false);
        component.find(AddHeroIcon).at(0).simulate('click');
        expect(component.state().modalOpen).toBe(true);
    });

    it('Should update preferred heroes on modal close', function() {
        const heroName = 'doomfist';

        component.find(AddHeroIcon).at(0).simulate('click');

        componentInstance.setHeroPreference(heroName);

        expect(componentInstance.state.modalOpen).toBeTruthy();
        expect(component.find(PreferredHeroSelector)).toHaveLength(1);

        expect(Model.updatePreferredHeroes).not.toHaveBeenCalledWith([heroName]);
        componentInstance.closeModal();
        expect(Model.updatePreferredHeroes).toHaveBeenCalledWith([heroName]);
    });

    describe('setHeroPreference', () => {
        it('Should update the hero for the currently selected slot', () => {
            const heroName = 'doomfist';
            expect(componentInstance.state.pendingPreferredHeroes).toEqual(expect.arrayContaining([]));
            componentInstance.setHeroPreference(heroName);
            expect(componentInstance.state.pendingPreferredHeroes).toEqual(expect.arrayContaining([heroName]));
        });
    });

    describe('when genji and tracer are preferred', () => {
        const preferredHeroes = ['genji', 'tracer'];
        beforeEach(() => {
            component = shallowPreferredHeroesContainer(preferredHeroes);
            componentInstance = component.instance();
        });

        describe('clearHeroPreference', () => {
            it('Should update the hero for the currently selected slot', () => {
                expect(componentInstance.state.pendingPreferredHeroes).toEqual(expect.arrayContaining(['genji', 'tracer']));
                componentInstance.clearHeroPreference();
                expect(componentInstance.state.pendingPreferredHeroes).toEqual(expect.arrayContaining(['tracer']));
            });
        });

        describe('setSelectedSlot', () => {
            it('Should allow any slot with a preferenced hero to be selected', () => {
                expect(componentInstance.state.selectedSlot).toEqual(1);
                componentInstance.setSelectedSlot(2);
                expect(componentInstance.state.selectedSlot).toEqual(2);
            });

            it('Should allow default to the lowest unpreferenced slot when passed a higher slot', () => {
                expect(componentInstance.state.selectedSlot).toEqual(1);
                componentInstance.setSelectedSlot(4);
                expect(componentInstance.state.selectedSlot).toEqual(3);
            });
        });
    });
});