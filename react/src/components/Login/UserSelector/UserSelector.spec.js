import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import { users as arrayUsers} from '../../../resources/users';
import UserSelector from './UserSelector';
import UserCard from '../../UserCard/UserCard';
import { home, error } from '../../Routes/links';

const mockStore = configureStore();
const getUserSelectorComponent = (users, region) => {
    let store = mockStore({
        region: region
    });
    return shallow(
        <UserSelector users={users} store={store}/>
    ).dive();
};

let open, send, onload, onerror, setRequestHeader, responseURL;
const getXhrMockClass = () => {
    open = jest.fn();
    send = jest.fn().mockImplementation(function(){
        onload = this.onload.bind(this);
        onerror = this.onerror.bind(this);
    });
    setRequestHeader = jest.fn();
    responseURL = home;

    return function () {
        return {
            open,
            send,
            setRequestHeader,
            responseURL,
        };
    };
};

const mockXMLHttpRequest = (xhrMockClass) => {
    window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);
}

describe('UserSelector', () => {
    window.location.assign = jest.fn();
    const region = 'us';
    const user = arrayUsers[0];
    const platform = user.platform;
    const username = user.platformDisplayName;
    const consoleCallbackUrl = `auth/${platform}/callback?region=${region}&username=${username}&password=none`;
    let UserSelectorComponent;

    beforeEach(() => {
        UserSelectorComponent = getUserSelectorComponent(arrayUsers, 'us');
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

        beforeEach(() => {
            mockXhr = getXhrMockClass();
            mockXMLHttpRequest(mockXhr);
            UserSelectorComponent.find(UserCard).at(0).simulate('click', user);
            expect(open).toBeCalledWith('POST', consoleCallbackUrl, true);
            expect(send).toBeCalled();
        });

        it('should wait to redirect till post is successful', () => {
            expect(window.location.assign).not.toHaveBeenCalledWith(responseURL);
            onload();
            expect(window.location.assign).toHaveBeenCalledWith(responseURL);
        });

        it('should post the the correct headers and callback url', () => {
            expect(setRequestHeader).toBeCalledWith("Content-type", "application/x-www-form-urlencoded");
        });

        it('should redirect to undefined', () => {
            onload();
            expect(window.location.assign).toHaveBeenCalledWith(responseURL);
        });

        it('should redirect to error path', () => {
            onerror();
            expect(window.location.assign).toHaveBeenCalledWith(error);
        });
    });
});