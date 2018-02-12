import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import renderer from 'react-test-renderer';
import { createRenderer } from 'react-test-renderer/shallow';
import { shallow} from 'enzyme';

import HeroRoles from './HeroRolesList';
import HeroCard from '../HeroCard/HeroCard';
import HeroReducer from '../../../../../reducers/HeroReducer';
import {addHero} from "../../../../../actions/hero";
import heroes from '../../../../../resources/heroes';
import {users} from '../../../../../resources/users';
import groupInvites from '../../../../../resources/groupInvites';


const realStore = createStore(combineReducers({heroes:HeroReducer}),{group: groupInvites[0]});
const setup = propOverrides => {
    const props = Object.assign({
        role: 'tank',        
        heroes: [heroes[0]],
        user: users[0]
    }, propOverrides);


    const renderer = createRenderer();
    renderer.render(<Provider store = {realStore}>
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
        realStore.dispatch(addHero(heroes[0]));
        
        const wrapper = shallow(
            <Provider store ={realStore}>
                <HeroRoles heroes={[heroes[0]]} role="tank" user={users[0]}/>
            </Provider>
        );

        expect(wrapper.find(HeroRoles)).toHaveLength(1);
        expect(wrapper.dive().find(HeroCard)).toHaveLength(1);
    });

    it('should match the snapshot', () => {
        let mockStore = configureStore();
        let store = mockStore({
            group: groupInvites[0]
        })
        let component = renderer.create(
            <Provider store={store}>
                <HeroRoles heroes={heroes} role="tank" user={{platformDisplayName: 'myName'}}/>
            </Provider>
        );

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        component = renderer.create(
            <Provider store ={store}>
                <HeroRoles heroes={[heroes[0]]} role="offensive" user={{platformDisplayName: 'myName'}}/>
            </Provider>
        );

        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
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