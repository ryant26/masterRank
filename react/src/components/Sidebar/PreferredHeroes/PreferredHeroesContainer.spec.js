import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import {createStore} from '../../../model/store';
import Model from '../../../model/model';
import {addHero} from '../../../actionCreators/preferredHeroes/preferredHeroes';
import AddHeroIcon from './AddHeroIcon';
import PreferredHeroSelector from './PreferredHeroSelector/PreferredHeroSelector';

const MockSocket = require('socket-io-mock');

import PreferredHeroesContainer from './PreferredHeroesContainer';

const mountWithHeroes = (heroes=[], store=createStore()) => {
    heroes.forEach((hero, i) => {
        store.dispatch(addHero(hero, i + 1));
    });

    return mount(
        <PreferredHeroesContainer store={store}/>
        , {context: {store}}
    );
};

describe('<PreferredHeroesContainer/>', () => {
    let wrapper;
    let store;

    beforeEach(() => {
        store = createStore();
        Model.initialize(new MockSocket(), store);
        wrapper = mountWithHeroes([], store);
    });

    it('Should render without exploding', () => {
        const PreferredHerosContainer = wrapper.find(PreferredHeroesContainer);
        expect(PreferredHerosContainer.length).toBeTruthy();
    });

    it('Should render in the correct format without any preferred heroes', () => {
        const component = renderer.create(
            <PreferredHeroesContainer store={store}/>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Should render in the correct format with preferred heroes', () => {
        store.dispatch(addHero('genji', 1));
        store.dispatch(addHero('tracer', 2));
        store.dispatch(addHero('winston', 3));
        store.dispatch(addHero('mei', 4));
        store.dispatch(addHero('phara', 5));

        const component = renderer.create(
            <PreferredHeroesContainer store={store}/>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Should open the modal when a slot is clicked', function() {
        // State and DOM should match
        expect(wrapper.find("PreferredHeroesContainer").instance().state.modalOpen).toBeFalsy();
        expect(wrapper.find(PreferredHeroSelector).length).toBeFalsy();

        let node = wrapper.find(AddHeroIcon).at(0);
        node.simulate('click');

        // State and DOM should match
        expect(wrapper.find("PreferredHeroesContainer").instance().state.modalOpen).toBeTruthy();
        expect(wrapper.find(PreferredHeroSelector).length).toBeTruthy();
    });

    it('Should update preferred heroes on modal close', function() {
        const heroName = 'doomfist';
        let realFunction = Model.updatePreferredHeroes;
        Model.updatePreferredHeroes = jest.fn();

        let node = wrapper.find(AddHeroIcon).at(0);
        node.simulate('click');

        wrapper.find('PreferredHeroesContainer').instance().setHeroPreference(heroName);

        expect(wrapper.find("PreferredHeroesContainer").instance().state.modalOpen).toBeTruthy();
        expect(wrapper.find(PreferredHeroSelector).length).toBeTruthy();

        expect(Model.updatePreferredHeroes).not.toHaveBeenCalledWith([heroName]);

        wrapper.find('.close-button').simulate('click');

        expect(Model.updatePreferredHeroes).toHaveBeenCalledWith([heroName]);
        Model.updatePreferredHeroes = realFunction;
    });

    describe('setHeroPreference', () => {
        it('Should update the hero for the currently selected slot', () => {
            const heroName = 'doomfist';
            expect(wrapper.find('PreferredHeroesContainer').instance().state.pendingPreferredHeroes).toEqual(expect.arrayContaining([]));
            wrapper.find('PreferredHeroesContainer').instance().setHeroPreference(heroName);
            expect(wrapper.find('PreferredHeroesContainer').instance().state.pendingPreferredHeroes).toEqual(expect.arrayContaining([heroName]));
        });
    });

    describe('clearHeroPreference', () => {
        it('Should update the hero for the currently selected slot', () => {
            wrapper = mountWithHeroes(['genji', 'tracer']);

            expect(wrapper.find('PreferredHeroesContainer').instance().state.pendingPreferredHeroes).toEqual(expect.arrayContaining(['genji', 'tracer']));
            wrapper.find('PreferredHeroesContainer').instance().clearHeroPreference();
            expect(wrapper.find('PreferredHeroesContainer').instance().state.pendingPreferredHeroes).toEqual(expect.arrayContaining(['tracer']));
        });
    });

    describe('setSelectedSlot', () => {
        it('Should allow any slot with a preferenced hero to be selected', () => {
            wrapper = mountWithHeroes(['genji', 'tracer']);

            expect(wrapper.find('PreferredHeroesContainer').instance().state.selectedSlot).toEqual(1);
            wrapper.find('PreferredHeroesContainer').instance().setSelectedSlot(2);
            expect(wrapper.find('PreferredHeroesContainer').instance().state.selectedSlot).toEqual(2);
        });

        it('Should allow default to the lowest unpreferenced slot when passed a higher slot', () => {
            wrapper = mountWithHeroes(['genji', 'tracer']);

            expect(wrapper.find('PreferredHeroesContainer').instance().state.selectedSlot).toEqual(1);
            wrapper.find('PreferredHeroesContainer').instance().setSelectedSlot(4);
            expect(wrapper.find('PreferredHeroesContainer').instance().state.selectedSlot).toEqual(3);
        });
    });
});