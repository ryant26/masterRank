import React from 'react';
import { shallow } from 'enzyme';

import BlizzardOAuth from './BlizzardOAuth';
import configureStore from 'redux-mock-store';

const mockStore = configureStore();

describe('BlizzardOAuth', () => {

    let BlizzardOAuthComponent;
    let store;

    beforeEach(() => {
        store = mockStore({});
        BlizzardOAuthComponent = shallow(
            <BlizzardOAuth region="us" store={store}/>
        ).dive();
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

    it('should call the setLoading function when button is clicked', () => {
        let setLoading = jest.fn();
        BlizzardOAuthComponent.setProps({setLoading});

        expect(setLoading).not.toHaveBeenCalled();
        BlizzardOAuthComponent.find('button').simulate('click');
        expect(setLoading).toHaveBeenCalled();
    });
});