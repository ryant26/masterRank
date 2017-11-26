import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { createRenderer } from 'react-test-renderer/shallow';
import { mount } from 'enzyme';

import HeroRoles from './HeroRoles';
import HeroCard from '../HeroCard/HeroCard';
import HeroReducer from '../../reducers/HeroReducer';

const setup = propOverrides => {
    const props = Object.assign({
        role: 'tank',        
        heroes: [{heroName:'orisa', voice_line: 'just doing my job'}]
    }, propOverrides);

    const store = createStore(combineReducers({heroes:HeroReducer}));

    const renderer = createRenderer();
    renderer.render(<Provider store = {store}> 
                        <HeroRoles {...props}/>
                    </Provider>);
    const output = renderer.getRenderOutput();

    return {
        props: props,
        output: output
    };
};

describe('HeroRoles Component', () => {
    it('should render without exploding', () => {
      const store = createStore(combineReducers({heroes:HeroReducer}));
        
        const wrapper = mount(
            <Provider store ={store}> 
                <HeroRoles heroes={store.getState().heroes} role="tank"/>
            </Provider>
        );

        const HeroRolesComponent = wrapper.find(HeroRoles);
        const HeroCardComponent = HeroRolesComponent.find(HeroCard);

        expect(HeroRolesComponent.length).toBeTruthy();
        expect(HeroCardComponent.length).toBeTruthy();
    });

    it('should render container with one hero with correct role', () => {
        const { output } = setup();
        expect(output.props.role).toBe('tank');
    });

    it('should render container with one hero with correct name', () => {
        const { output } = setup();
        expect(output.props.heroes[0].heroName).toBe('orisa');
    });
}); 