import React from 'react';
import { shallow } from 'enzyme';

import BlizzardOAuth from 'components/Login/BlizzardOAuth/BlizzardOAuth';
import LoginFailedCard from 'components/Login/LoginFailedCard/LoginFailedCard';
import { startLoginTrackingEvent } from 'actionCreators/googleAnalytic/googleAnalytic';
jest.mock('actionCreators/googleAnalytic/googleAnalytic');
import { pushBlockingEvent as pushBlockingEventAction } from 'actionCreators/loading';
jest.mock('actionCreators/loading');

import configureStore from 'redux-mock-store';
import { mockLocation } from 'utilities/test/mockingUtilities';

const mockStore = configureStore();

const getBlizzardOAuth = (region, platform) => {
    let store = mockStore({});
    store.dispatch = jest.fn();

    return shallow(
        <BlizzardOAuth region={region} platform={platform} store={store}/>
    ).dive();
};

describe('BlizzardOAuth', () => {
    const region = 'us';
    const platform = 'pc';
    let BlizzardOAuthComponent;

    beforeEach(() => {
        BlizzardOAuthComponent = getBlizzardOAuth(region, platform);
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

    describe('when clicked', () => {

        beforeEach(() => {
            mockLocation();
            expect(startLoginTrackingEvent).not.toHaveBeenCalled();
            expect(pushBlockingEventAction).not.toHaveBeenCalled();
            BlizzardOAuthComponent.find('.button-primary').simulate('click');
        });

        afterEach(() => {
            startLoginTrackingEvent.mockClear();
            pushBlockingEventAction.mockClear();
        });

        it('should redirect to "/auth/bnet/callback?region=us"', () => {
            expect(window.location.assign).toHaveBeenCalledWith(`/auth/bnet/callback?region=${region}`);
        });

        it('should dispatch pushBlockingEventAction when button is clicked', () => {
            expect(pushBlockingEventAction).toHaveBeenCalled();
        });

        it("should dispatch startLoginTrackingEvent with user's platform", () => {
            expect(startLoginTrackingEvent).toHaveBeenCalledWith(platform);
        });
    });
});