import React from 'react';
import { Redirect } from 'react-router';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import 'isomorphic-fetch';

import Authentication from './Authentication';
import LoginPage from '../../../pages/LoginPage/LoginPage';
import token from '../../../resources/token';
import { home } from '../../Routes/links';

const decode  = require('jwt-decode');

const getConnectAuthenticationContainer = () => {
    let mockStore = configureStore();
    return shallow(
        <Authentication updateUserAction={jest.fn()} store={mockStore()} />
    );
};

const mockLocalStorage = () => {
    const localStorageMock = {
        setItem: jest.fn()
    };
    window.localStorage = localStorageMock;
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

        beforeEach( async () => {
            mockLocalStorage();
            setCookie('access_token', token);
            window.fetch = jest.fn().mockImplementation(() => Promise.resolve(
                mockResponse(200, null, user)
            ));

            connectAuthenticationContainer = getConnectAuthenticationContainer();
            await connectAuthenticationContainer.dive();
        });

        it('should move access token in cookies to local storage', () => {
            expect(window.localStorage.setItem).toHaveBeenCalledWith('accessToken', token);
        });

        it('should fetch from correct url', () => {
            let encodedDisplayName = encodeURIComponent(platformDisplayName);
            let fetchUrl = `/api/players?platformDisplayName=${encodedDisplayName}&platform=${platform}&region=${region}`;
            expect(window.fetch).toHaveBeenCalledWith(fetchUrl);
        });

        xit('should dispatch user update action', () => {
            //TODO: Cant figure out how to pass mapTo... in unit tests.
            expect(connectAuthenticationContainer.instance().props.updateUserAction).toHaveBeenCalledWith(user);
        });

        it('should delete the access token in cookies', () => {
            expect(document.cookie).toBe('');
        });
    });
});