import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import { users as arrayUsers} from '../../../resources/users';
import UserSelector from './UserSelector';
import UserCard from '../../UserCard/UserCard';
import { home, error } from '../../Routes/links';

const mockStore = configureStore();

describe('UserSelector', () => {
    const region = 'us';
    const user = arrayUsers[0];
    const platform = user.platform;
    const username = user.platformDisplayName;
    const consoleCallbackUrl = `auth/${platform}/callback?region=${region}&username=${username}&password=none`;
    let store;
    let UserSelectorComponent;

    const getUserSelectorComponent = (users, region) => {
        store = mockStore({
            region: region
        });
        return shallow(
            <UserSelector users={users} store={store}/>
        ).dive();
    };

    beforeEach(() => {
        window.location.assign = jest.fn();
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
            mockXhr = getXhrMockClass();
            window.XMLHttpRequest = () => mockXhr;
            UserSelectorComponent.find(UserCard).at(0).simulate('click', user);
            expect(mockXhr.open).toBeCalledWith('POST', consoleCallbackUrl, true);
            expect(mockXhr.send).toBeCalled();
        });

        it('should set the loading state', () => {
            expect(store.getActions()).toContainEqual(expect.objectContaining({type: 'loading/PUSH_BLOCKING_EVENT'}));
        });

        it('should clear the loading state when the request returns successfully', () => {
            expect(store.getActions()).not.toContainEqual(expect.objectContaining({type: 'loading/POP_BLOCKING_EVENT'}));
            mockXhr.onload();
            expect(store.getActions()).toContainEqual(expect.objectContaining({type: 'loading/POP_BLOCKING_EVENT'}));
        });

        it('should clear the loading state when the request returns unsuccessfully', () => {
            expect(store.getActions()).not.toContainEqual(expect.objectContaining({type: 'loading/POP_BLOCKING_EVENT'}));
            mockXhr.onerror();
            expect(store.getActions()).toContainEqual(expect.objectContaining({type: 'loading/POP_BLOCKING_EVENT'}));
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

        it('should redirect to error path', () => {
            mockXhr.onerror();
            expect(window.location.assign).toHaveBeenCalledWith(error);
        });
    });
});