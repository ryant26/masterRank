import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import UserSelector from 'components/Login/UserSelector/UserSelector';
import UserCard from 'components/UserCard/UserCard';
import { home } from 'components/Routes/links';
import {
    pushBlockingEvent as pushLoadingEventAction,
    popBlockingEvent as popLoadingEventAction
} from 'actionCreators/loading';
jest.mock('actionCreators/loading');
import { startLoginTrackingEvent } from 'actionCreators/googleAnalytic/googleAnalytic';
jest.mock('actionCreators/googleAnalytic/googleAnalytic');

import { users as arrayUsers} from 'resources/users';
import { mockLocation } from 'utilities/test/mockingUtilities';

const mockStore = configureStore();

const getUserSelectorComponent = (users, region) => {
    let store = mockStore({
        region: region
    });
    store.dispatch = jest.fn();

    return shallow(
        <UserSelector users={users} store={store}/>
    ).dive();
};

describe('UserSelector', () => {
    const region = 'us';
    const user = arrayUsers[0];
    const platform = user.platform;
    const username = user.platformDisplayName;
    const consoleCallbackUrl = `/auth/${platform}/callback?region=${region}&username=${username}&password=none`;
    let UserSelectorComponent;

    beforeEach(() => {
        UserSelectorComponent = getUserSelectorComponent(arrayUsers, region);
    });

    it('should render when component loads', () => {
        expect(UserSelectorComponent).toHaveLength(1);
    });

    it('should render a UserButton component for the users that where passed in', async () => {
        expect(UserSelectorComponent.find(UserCard)).toHaveLength(2);
        expect(UserSelectorComponent.find(UserCard).at(0).prop('user')).toBe(arrayUsers[0]);
        expect(UserSelectorComponent.find(UserCard).at(1).prop('user')).toBe(arrayUsers[1]);
    });

    describe('when UserCard is clicked', () => {
        let mockXhr;

        const getXhrMockClass = () => {
            return {
                open: jest.fn(),
                send: jest.fn(),
                setRequestHeader: jest.fn(),
                responseURL: home,
            };
        };

        beforeEach(() => {
            mockLocation();
            mockXhr = getXhrMockClass();
            window.XMLHttpRequest = () => mockXhr;
            expect(startLoginTrackingEvent).not.toHaveBeenCalled();
            expect(pushLoadingEventAction).not.toHaveBeenCalled();
            UserSelectorComponent.find(UserCard).at(0).simulate('click', user);
            expect(mockXhr.open).toBeCalledWith('POST', consoleCallbackUrl, true);
            expect(mockXhr.send).toBeCalled();
        });

        afterEach(() => {
            startLoginTrackingEvent.mockClear();
            pushLoadingEventAction.mockClear();
            popLoadingEventAction.mockClear();
        });

        it("should dispatch startLoginTrackingEvent with user's platform", () => {
            expect(startLoginTrackingEvent).toHaveBeenCalledWith(platform);
        });

        it('should set the loading state', () => {
            expect(pushLoadingEventAction).toHaveBeenCalled();
        });

        it('should clear the loading state when the request returns successfully', () => {
            expect(popLoadingEventAction).not.toHaveBeenCalled();
            mockXhr.onload();
            expect(popLoadingEventAction).toHaveBeenCalled();
        });

        it('should clear the loading state when the request returns unsuccessfully', () => {
            expect(popLoadingEventAction).not.toHaveBeenCalled();
            mockXhr.onerror();
            expect(popLoadingEventAction).toHaveBeenCalled();
        });

        it('should wait to redirect till post is successful', () => {
            expect(window.location.assign).not.toHaveBeenCalledWith(mockXhr.responseURL);
            mockXhr.onload();
            expect(window.location.assign).toHaveBeenCalledWith(mockXhr.responseURL);
        });

        it('should post the the correct headers and callback url', () => {
            expect(mockXhr.setRequestHeader).toBeCalledWith("Content-type", "application/x-www-form-urlencoded");
        });

        it('should redirect to undefined', () => {
            mockXhr.onload();
            expect(window.location.assign).toHaveBeenCalledWith(mockXhr.responseURL);
        });
    });
});