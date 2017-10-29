import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { createRenderer } from 'react-test-renderer/shallow';
import { mount } from 'enzyme';
import HeroRoles from '../components/HeroRoles';
import HeroReducer from '../reducers/HeroReducer';
import HeroCard from '../components/HeroCard';

const setup = propOverrides => {
    const props = Object.assign({
        heroes: [{name:'orisa', average_stats: 'just doing my job'}],
        role: 'defense'
    }, propOverrides);

    const store = createStore(
        HeroReducer
    );

    const renderer = createRenderer();
    renderer.render(<Provider store={store}>
                        <HeroRoles {...props}/>
                    </Provider>);
    const output = renderer.getRenderOutput();

    return {
        props: props,
        output: output
    }
}

describe('HeroRoles Component', () => {
    it('should render without exploding', () => {
        const store = createStore(
            HeroReducer
        );
        
        const wrapper = mount(
			<Provider store={store}>
                <HeroRoles heroes={[{name:'orisa', average_stats: 'just doing my job'}]} role='defense'/>
            </Provider>
        );
        
        const HeroRolesComponent = wrapper.find(HeroRoles);
        const HeroCardComponent = HeroRolesComponent.find(HeroCard);

        expect(HeroRolesComponent.length).toBeTruthy();
        expect(HeroCardComponent.length).toBeTruthy();
    });

    it('should render container with one hero with correct role', () => {
        const { output } = setup();
        expect(output.props.role).toBe('defense');
    });

    it('should render container with one hero with correct name', () => {
        const { output } = setup();
        expect(output.props.heroes[0].name).toBe('orisa');
    });
}); 