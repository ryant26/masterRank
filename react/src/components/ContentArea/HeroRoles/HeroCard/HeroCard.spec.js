import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import HEROS from '../../../../resources/heroes';
import {users} from '../../../../resources/users';
import HeroCard from './HeroCard';

describe('HeroCard Component',()=> {
    let getHeroConfig = function() {
        return Object.assign({}, HEROS[0]);
    };

    let getUser = function() {
        return Object.assign({}, users[0]);
    };

    it('should render without exploding', () => {
        const wrapper = mount(
            <HeroCard hero={getHeroConfig()} user={getUser()}/>
        );

        const HeroCardComponent = wrapper.find(HeroCard);
        expect(HeroCardComponent).toBeTruthy();
    });

    it('should not have the invitable class for the users own heroes', () => {
        const platformDisplayName = 'pwnshopp';
        let heroConfig = getHeroConfig();
        let user = getUser();

        heroConfig.platformDisplayName = platformDisplayName;
        user.platformDisplayName = platformDisplayName;

        const wrapper = mount (
            <HeroCard hero={heroConfig} user={user}/>
        );

        expect(wrapper.find('.invitable').length).toBe(0);
    });

    it('should have the invitable class for other users heroes', () => {
        const platformDisplayName = 'pwnshopp';
        let heroConfig = getHeroConfig();
        let user = getUser();

        heroConfig.platformDisplayName = platformDisplayName;
        user.platformDisplayName = 'not_pwnshopp';

        const wrapper = mount (
            <HeroCard hero={heroConfig} user={user}/>
        );

        expect(wrapper.find('.invitable').length).toBe(1);
    });

    it('should toggle the stats card on click', () => {
        const component = renderer.create(
            <HeroCard hero={getHeroConfig()} user={getUser()}/>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        component.getInstance().toggleStats();  
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        component.getInstance().toggleStats();  
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();

    });
});