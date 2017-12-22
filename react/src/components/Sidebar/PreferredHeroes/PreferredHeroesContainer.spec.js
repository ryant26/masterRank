import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import {createStore} from '../../../model/store';
import Model from '../../../model/model';
import {addHero} from '../../../actions/preferredHeroes';
import AddHeroIcon from './AddHeroIcon';
import PreferredHeroSelector from './PreferredHeroSelector/PreferredHeroSelector';

const MockSocket = require('socket-io-mock');

import PreferredHeroesContainer from './PreferredHeroesContainer';

describe('<PreferredHeroesContainer/>', () => {
    let wrapper;
    let store;

    beforeEach(() => {
        store = createStore();
        Model.initialize(new MockSocket(), store);
        wrapper = mount(
            <PreferredHeroesContainer store={store}/>
        , {context: {store}});
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
});