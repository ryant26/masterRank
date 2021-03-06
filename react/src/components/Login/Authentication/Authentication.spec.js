import React from 'react';
import { Redirect } from 'react-router';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import 'isomorphic-fetch';

import Authentication from 'components/Login/Authentication/Authentication';
import LoginPage from 'pages/LoginPage/LoginPage';
import token from 'resources/token';
import { home } from 'components/Routes/links';
import { updateUser as updateUserAction } from 'actionCreators/user';
jest.mock('actionCreators/user');
import { authenticationTrackingEvent } from 'actionCreators/googleAnalytic/googleAnalytic';
jest.mock('actionCreators/googleAnalytic/googleAnalytic');

const decode  = require('jwt-decode');

const mockStore = configureStore();
const getConnectAuthenticationContainer = () => {
    let store = mockStore({});
    store.dispatch = jest.fn();

    return shallow(
        <Authentication updateUserAction={jest.fn()} store={store} />
    );
};

const mockLocalStorage = () => {
    window.localStorage = {
        setItem: jest.fn()
    };
};

const setCookie = (key, value) => {
    document.cookie = `${key}=${value}`;
};

const mockResponse = (status, statusText, jsonObj) => {
    return new Response(JSON.stringify(jsonObj), {
        status: status,
        statusText: statusText,
        headers: {
            'Content-type': 'application/json'
        }
    });
};

describe('Authentication', () => {
    let user = decode(token);
    let region = user.region;
    let platformDisplayName = user.platformDisplayName;
    let platform = user.platform;

    describe('when access token is', () => {
        let AuthenticationComponent;

        beforeEach(() => {
            AuthenticationComponent = getConnectAuthenticationContainer().dive();
        });

        it('undefined should render login page', () => {
            AuthenticationComponent.setState({
                accessToken: undefined,
            });

            expect(AuthenticationComponent.find(LoginPage)).toHaveLength(1);
        });

        it('defined should redirect home', () => {
            AuthenticationComponent.setState({
                accessToken: token,
            });
            expect(AuthenticationComponent.find(LoginPage)).toHaveLength(0);
            expect(AuthenticationComponent.find(Redirect)).toHaveLength(1);
            expect(AuthenticationComponent.find(Redirect).props().to).toBe(home);
        });
    });

    describe('when fetching a user', () => {
        let connectAuthenticationContainer;

        beforeEach( () => {
            mockLocalStorage();
            setCookie('access_token', token);
            let fetchPromise = Promise.resolve(
                mockResponse(200, null, user)
            );
            window.fetch = jest.fn().mockImplementation(() => fetchPromise);

            connectAuthenticationContainer = getConnectAuthenticationContainer();
            connectAuthenticationContainer.dive();
            return fetchPromise;
        });

        afterEach(() => {
            updateUserAction.mockClear();
            authenticationTrackingEvent.mockClear();
        });

        it('should move access token in cookies to local storage', () => {
            expect(window.localStorage.setItem).toHaveBeenCalledWith('accessToken', token);
        });

        it('should fetch from correct url', () => {
            let encodedDisplayName = encodeURIComponent(platformDisplayName);
            let fetchUrl = `/api/players?platformDisplayName=${encodedDisplayName}&platform=${platform}&region=${region}`;
            expect(window.fetch).toHaveBeenCalledWith(fetchUrl);
        });

        it('should dispatch user update action', () => {
            expect(updateUserAction).toHaveBeenCalledWith(user);
        });

        it("should track successful authentication with user's platform display name", () => {
            expect(authenticationTrackingEvent).toHaveBeenCalledWith(user.platformDisplayName);
        });

        it('should delete the access token in cookies', () => {
            expect(document.cookie).toBe('');
        });
    });
});