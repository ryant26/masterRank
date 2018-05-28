import React from 'react';
import { shallow } from 'enzyme';

import BlizzardOAuth from 'components/Login/BlizzardOAuth/BlizzardOAuth';
import LoginFailedCard from 'components/Login/LoginFailedCard/LoginFailedCard';
import ScrollButton from 'components/Login/SiteInformation/ScrollButton/ScrollButton';
import SiteInformation from 'components/Login/SiteInformation/SiteInformation';
import { signInTrackingEvent } from 'actionCreators/googleAnalytic/googleAnalytic';
jest.mock('actionCreators/googleAnalytic/googleAnalytic');
import { pushBlockingEvent as pushBlockingEventAction } from 'actionCreators/loading';
jest.mock('actionCreators/loading');

import configureStore from 'redux-mock-store';
import { mockLocation } from 'utilities/test/mockingUtilities';

const mockStore = configureStore();

const getBlizzardOAuth = (region, platform, disabled) => {
    let store = mockStore({});
    store.dispatch = jest.fn();

    return shallow(
        <BlizzardOAuth region={region} platform={platform} store={store} disabled={disabled}/>
    ).dive();
};

describe('BlizzardOAuth', () => {
    const region = 'us';
    const platform = 'pc';
    const disabled = true;
    let BlizzardOAuthComponent;

    beforeEach(() => {
        BlizzardOAuthComponent = getBlizzardOAuth(region, platform, disabled);
    });

    it('should render when component loads', () => {
        expect(BlizzardOAuthComponent).toHaveLength(1);
    });

    it('should render a login button with the proper wording when component loads', () => {
        expect(BlizzardOAuthComponent.find('.button-content').text()).toBe('LOGIN VIA BATTLE.NET');
    });

    it('should render the loginFailedCard', () => {
        expect(BlizzardOAuthComponent.find(LoginFailedCard)).toHaveLength(1);
    });

    it('should remove ScrollButton from dom if isLoading is true', () => {
        expect(BlizzardOAuthComponent.find(ScrollButton)).toHaveLength(1);
        BlizzardOAuthComponent.setState({
            isLoading: true
        });
        expect(BlizzardOAuthComponent.find(ScrollButton)).toHaveLength(0);
    });

    it('should remove SiteInfo from dom if isLoading is true', () => {
        expect(BlizzardOAuthComponent.find(SiteInformation)).toHaveLength(1);
        BlizzardOAuthComponent.setState({
            isLoading: true
        });
        expect(BlizzardOAuthComponent.find(SiteInformation)).toHaveLength(0);
    });

    describe('login button on gdpr compliance', () => {
        
        it('should be disabled when disabled is true and region is eu', () => {
            const region = 'eu';
            const platform = 'pc';
            const disabled = true;
            BlizzardOAuthComponent = getBlizzardOAuth(region, platform, disabled);
            expect(BlizzardOAuthComponent.find('.button-primary').props().disabled).toBe(true);
        });
    
        it('should be enabled when disabled is false and region is eu', () => {
            const region = 'eu';
            const platform = 'pc';
            const disabled = false;
            BlizzardOAuthComponent = getBlizzardOAuth(region, platform, disabled);
            expect(BlizzardOAuthComponent.find('.button-primary').props().disabled).toBe(false);
        });
    });

    describe('when clicked', () => {

        beforeEach(() => {
            mockLocation();
            expect(signInTrackingEvent).not.toHaveBeenCalled();
            expect(pushBlockingEventAction).not.toHaveBeenCalled();
            BlizzardOAuthComponent.find('.button-primary').simulate('click');
        });

        afterEach(() => {
            signInTrackingEvent.mockClear();
            pushBlockingEventAction.mockClear();
        });

        it('should redirect to "/auth/bnet/callback?region=us"', () => {
            expect(window.location.assign).toHaveBeenCalledWith(`/auth/bnet/callback?region=${region}`);
        });

        it('should dispatch pushBlockingEventAction when button is clicked', () => {
            expect(pushBlockingEventAction).toHaveBeenCalled();
        });

        it("should dispatch signInTrackingEvent with user's platform", () => {
            expect(signInTrackingEvent).toHaveBeenCalledWith(platform);
        });

        it('should set the state of isLoading to true', () => {
            expect(BlizzardOAuthComponent.state().isLoading).toBe(true);
        });
    });
});