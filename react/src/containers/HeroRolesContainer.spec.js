import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { mount } from 'enzyme';
import HeroRolesContainer from './HeroRolesContainer';
import HeroReducer from '../reducers/HeroReducer';

describe('Hero Roles Container', () => {
    it ('should render without exploding', () => {
        const store = createStore(
            HeroReducer
        );
        
        const wrapper = mount(
            <Provider store = {store}> 
                <HeroRolesContainer />
            </Provider>
        );

        const HeroRolesContainerComponent = wrapper.find(HeroRolesContainer);
        expect(HeroRolesContainerComponent.length).toBeTruthy();
    });
});