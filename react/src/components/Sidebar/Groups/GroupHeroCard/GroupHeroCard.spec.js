import React from 'react';
import { mount } from 'enzyme';
import * as USERS from '../../../../resources/users';

import GroupHeroCard from './GroupHeroCard';

describe('Group Hero Card',()=> {
    let getHeroConfig = function() {
        return USERS.users[0];
    };

    it ('should render without exploding', () => {
        const wrapper = mount(
            <GroupHeroCard hero={getHeroConfig()} number={'1'} name={'A Name'}/>
        );

        const GroupHeroCardComponent = wrapper.find(GroupHeroCard);
        expect(GroupHeroCardComponent).toBeTruthy();
    });

    it ('should render "You" as the group hero with value 1', () => {
        const wrapper = mount(
            <GroupHeroCard hero={getHeroConfig()} name={'You'} number={'1'}/>
        );

        const GroupHeroCardComponent = wrapper.find(GroupHeroCard);
        expect(GroupHeroCardComponent.text()).toBe('1You');
    });
});
