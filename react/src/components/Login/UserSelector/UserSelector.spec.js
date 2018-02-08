import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import { users as arrayUsers} from '../../../resources/users';
import UserSelector from './UserSelector';
import UserCard from '../../UserCard/UserCard';
import { error } from '../../Routes/links';

const mockStore = configureStore();
const getUserSelectorComponent = (users, region) => {
    let store = mockStore({
        region: region
    });
    return shallow(
        <UserSelector users={users} store={store}/>
    ).dive();
};

let open, send, onload, onerror, setRequestHeader;
function createXHRmock() {
    open = jest.fn();
    setRequestHeader = jest.fn();
    send = jest.fn().mockImplementation(function(){
        onload = this.onload.bind(this);
        onerror = this.onerror.bind(this);
    });

    const xhrMockClass = function () {
        return {
            open,
            send,
            setRequestHeader,
        };
    };

    window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);
}

describe('UserSelector', () => {
    window.location.assign = jest.fn();
    let UserSelectorComponent;
    let region = 'us';
    let user = arrayUsers[0];
    let platform = user.platform;
    let username = user.platformDisplayName;
    let consoleCallbackUrl = `auth/${platform}/callback?region=${region}&username=${username}&password=none`;

    beforeEach(() => {
        // replace the real XHR object with the mock XHR object before each test
        UserSelectorComponent = getUserSelectorComponent(arrayUsers, 'us');
    });

    afterEach(() => {
        // put the real XHR object back and clear the mocks after each test
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

        beforeEach(() => {
            createXHRmock();
            UserSelectorComponent.find(UserCard).at(0).simulate('click', user);
            expect(open).toBeCalledWith('POST', consoleCallbackUrl, true);
            expect(send).toBeCalled();
        });

        it('should wait to redirect till post is successful', () => {
            expect(window.location.assign).not.toHaveBeenCalledWith(undefined);
            onload();
            expect(window.location.assign).toHaveBeenCalledWith(undefined);
        });

        it('should post the the correct headers and callback url', () => {
            expect(setRequestHeader).toBeCalledWith("Content-type", "application/x-www-form-urlencoded");
        });

        it('should redirect to undefined', () => {
            onload();
            //TODO: how to mock xhr.responseURL
            expect(window.location.assign).toHaveBeenCalledWith(undefined);
        });

        it('should redirect to {error}', () => {
            onerror();
            expect(window.location.assign).toHaveBeenCalledWith({error});
        });
    });
});