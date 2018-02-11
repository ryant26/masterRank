import React from 'react';
import { mount } from 'enzyme';
import * as USERS from '../../../../resources/users';

import GroupHeroCard from './GroupHeroCard';

xdescribe('Group Hero Card',()=> {
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

    xit('should render leader if user is marked true for leader flag', () => {
        // we are going to change this styling
    });

    xit('should render pending if user is marked true for pending flag', () => {
        // we are going to change this styling
    });

    xit('should render hero name and platform display name', () => {
        
    });

    xit('should render you as username when you is passed as the userName', () => {

    });

    xit('should render your number based on the order you are listed', () => {

    });
});
