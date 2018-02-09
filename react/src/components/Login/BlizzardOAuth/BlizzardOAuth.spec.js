import React from 'react';
import { shallow } from 'enzyme';

import BlizzardOAuth from './BlizzardOAuth';

describe('BlizzardOAuth', () => {

    let BlizzardOAuthComponent;

    beforeEach(() => {
        BlizzardOAuthComponent = shallow(
            <BlizzardOAuth region="us"/>
        );
    });

    it('should render when component loads', () => {
        expect(BlizzardOAuthComponent).toHaveLength(1);
    });

    it('should render a login button with the proper wording when component loads', () => {
        expect(BlizzardOAuthComponent.find('.button-content').text()).toBe('LOGIN VIA BATTLE.NET');
    });

    it('should redirect to "/auth/bnet/callback?region=ANY_REGION" when button is clicked and props region is ANY_REGION', () => {
        window.location.assign = jest.fn();
        BlizzardOAuthComponent.setProps({
           region: 'ANY_REGION',
        });
        BlizzardOAuthComponent.find('button').simulate('click');
        expect(window.location.assign).toHaveBeenCalledWith('/auth/bnet/callback?region=ANY_REGION');
    });
});