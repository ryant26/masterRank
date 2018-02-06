import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import mock from 'xhr-mock';

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

    //TODO: With the way our proxies are set I have no clue how redirection is working
    xit('should post the the correct headers and callback url, when UserCard is clicked', async () => {
        expect.assertions(1);
        mock.post(consoleCallbackUrl, (req, res) => {
            expect(req.header('Content-Type')).toEqual('application/x-www-form-urlencoded');
            return res.status(200);
        });
        UserSelectorComponent.find(UserCard).at(0).simulate('click', user);
    });

    xit('should redirect to {home} when UserCard is clicked and post to console callback is 302', async () => {
        mock.post(consoleCallbackUrl, {
            status:200
        });
        UserSelectorComponent.find(UserCard).at(0).simulate('click', user);
        expect(window.location.assign).toHaveBeenCalledWith({home});
    });

    xit('should redirect to {error} when UserCard is clicked and post to console callback is not 302', () => {
//      let errorMessage = `An error occurred whilst posting to console ${consoleCallbackUrl}`;
        mock.post(consoleCallbackUrl, {
            status:500
        });
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