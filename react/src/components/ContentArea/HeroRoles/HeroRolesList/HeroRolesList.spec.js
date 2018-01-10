import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { createRenderer } from 'react-test-renderer/shallow';
import { mount } from 'enzyme';

import HeroRoles from './HeroRolesList';
import HeroCard from '../HeroCard/HeroCard';
import HeroReducer from '../../../../reducers/HeroReducer';
import {addHero} from "../../../../actions/hero";
import HEROES from '../../../../resources/heroes';
import {users} from '../../../../resources/users';

const setup = propOverrides => {
    const props = Object.assign({
        role: 'tank',        
        heroes: [HEROES[0]],
        user: users[0]
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

        store.dispatch(addHero(HEROES[0]));
        
        const wrapper = mount(
            <Provider store ={store}> 
                <HeroRoles heroes={store.getState().heroes} role="tank" user={users[0]}/>
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
        expect(output.props.heroes[0].heroName).toBe('soldier76');
    });
}); 