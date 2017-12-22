import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import {createStore} from '../../../../model/store';
import Model from '../../../../model/model';
import {addHero} from '../../../../actions/preferredHeroes';
import HeroButton from '../../../HeroSelector/HeroButton/HeroButton';
import HeroSlot from '../HeroSlot/HeroSlot';

const MockSocket = require('socket-io-mock');

import PreferredHeroSelector from './PreferredHeroSelector';

let renderComponent = (store) => {
    return renderer.create(
        <PreferredHeroSelector store={store} selectedHeroSlot={1} done={() => {}} changeSelectedHeroSlot={() => {}}/>
    );
};

describe('<PreferredHeroSelector/>', () => {
    let wrapper;
    let store;

    beforeEach(() => {
        store = createStore();
        let mockSocket = new MockSocket();
        mockSocket.addHero = () => {};
        Model.initialize(mockSocket, store);
        wrapper = mount(
            <PreferredHeroSelector store={store} done={() => {}} changeSelectedHeroSlot={() => {}}/>
        );
    });

    it('Should render without exploding', () => {
        const PreferredHeroSelectorNode = wrapper.find(PreferredHeroSelector);
        expect(PreferredHeroSelectorNode.length).toBeTruthy();
    });

    it('Should render in the correct format without any preferred heroes', () => {
        const component = renderComponent(store);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Should render in the correct format with preferred heroes', () => {
        store.dispatch(addHero('genji', 1));
        store.dispatch(addHero('tracer', 2));
        store.dispatch(addHero('winston', 3));
        store.dispatch(addHero('mei', 4));
        store.dispatch(addHero('phara', 5));

        const component = renderComponent(store);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Should set selectedHero in the state', () => {
        wrapper.find(HeroButton).at(0).simulate('click');
        expect(wrapper.find('PreferredHeroSelector').instance().state.selectedHero).toEqual('ana');
    });

    it('Should reflect the saved hero in the props', () => {
        wrapper.find(HeroButton).at(0).simulate('click');
        wrapper.find('button.button-primary').simulate('click');

        expect(wrapper.find('PreferredHeroSelector').instance().props.preferredHeroes).toEqual(['ana']);
    });

    it('Should reflect the selected hero slot in the props', () => {
        store.dispatch(addHero('genji', 1));
        store.dispatch(addHero('tracer', 2));
        store.dispatch(addHero('winston', 3));
        store.dispatch(addHero('mei', 4));
        store.dispatch(addHero('phara', 5));

        wrapper.find(HeroSlot).at(2).simulate('click');
        expect(wrapper.find('PreferredHeroSelector').instance().props.selectedHeroSlot).toEqual(3);
    });
});