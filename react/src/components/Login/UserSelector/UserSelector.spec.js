import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import mock from 'xhr-mock';

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

    // be aware we use *function* because we need to get *this*
    // from *new XmlHttpRequest()* call
    send = jest.fn().mockImplementation(function(){
        onload = this.onload.bind(this);
        onerror = this.onerror.bind(this);
        setRequestHeader = this.setRequestHeader.bind(this);
    });

    const xhrMockClass = function () {
        return {
            open,
            send,
            setRequestHeader
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
        mock.setup();
        UserSelectorComponent = getUserSelectorComponent(arrayUsers, 'us');
    });

    afterEach(() => {
        // put the real XHR object back and clear the mocks after each test
        mock.teardown();
    });

    it('should render when component loads', () => {
        expect(UserSelectorComponent).toHaveLength(1);
    });

    it('should render a UserButton component for the users that where passed in', async () => {
        expect(UserSelectorComponent.find(UserCard)).toHaveLength(2);
        expect(UserSelectorComponent.find(UserCard).at(0).prop('user')).toBe(arrayUsers[0]);
        expect(UserSelectorComponent.find(UserCard).at(1).prop('user')).toBe(arrayUsers[1]);
    });

    it('should post the the correct headers and callback url, when UserCard is clicked', async () => {
        expect.assertions(1);
        mock.post(consoleCallbackUrl, (req, res) => {
            expect(req.header('Content-Type')).toEqual('application/x-www-form-urlencoded');
            return res.status(200).responseURL();
        });
        UserSelectorComponent.find(UserCard).at(0).simulate('click', user);
    });

    it('should redirect to "" when UserCard is clicked and post to console callback is 302', async () => {
        createXHRmock();
        UserSelectorComponent.find(UserCard).at(0).simulate('click', user);

        // here you should call GET request
        expect(open).toBeCalledWith('POST', consoleCallbackUrl, true);
        expect(send).toBeCalled();
        // call onload or onerror
        onload();
        // here you can make your assertions after onload
        expect(window.location.assign).toHaveBeenCalledWith();
    });

    xit('should redirect to {error} when UserCard is clicked and post to console callback is not 302', () => {
//      let errorMessage = `An error occurred whilst posting to console ${consoleCallbackUrl}`;
        createXHRmock();
        // here you should call GET request
        expect(open).toBeCalledWith('POST', consoleCallbackUrl, true);
        expect(send).toBeCalled();
        // call onload or onerror
        onerror();
        UserSelectorComponent.find(UserCard).at(0).simulate('click', user);
        expect(window.location.assign).toHaveBeenCalledWith({error});
    });

     xit('should wait to redirect till post is complete', () => {
         mock.post(consoleCallbackUrl, {
             status:500
         });
         UserSelectorComponent.find(UserCard).at(0).simulate('click', user);
     });

});