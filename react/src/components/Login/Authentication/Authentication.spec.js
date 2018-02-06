import React from 'react';
import { Redirect } from 'react-router';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import Authentication from './Authentication';
import LoginPage from '../../../pages/LoginPage/LoginPage';

describe('Authentication', () => {
    const mockStore = configureStore();
    let AuthenticationContainer;
    let AuthenticationComponent;


    beforeEach(function() {
        let store = mockStore({
            state: {
                region: 'us'
            },
            dispatch: {
                updateUserAction: jest.fn()
            }
        });

        AuthenticationContainer = shallow(
            <Authentication store={store} />
        );

        AuthenticationComponent = AuthenticationContainer.dive();
    });

    it('should render login page when state access token is undefined', () => {
        AuthenticationComponent.setState({
            accessToken: undefined,
        });

        expect(AuthenticationComponent.find(LoginPage)).toHaveLength(1);
    });

    it('should not render login page and redirect to "/" when state access token is defined', () => {
        AuthenticationComponent.setState({
            accessToken: 'mock_token',
        });
        expect(AuthenticationComponent.find(LoginPage)).toHaveLength(0);
        expect(AuthenticationComponent.find(Redirect)).toHaveLength(1);
        expect(AuthenticationComponent.find(Redirect).props().to).toBe("/");
    });

    xit('should move access token in cookies to local storage and then delete the access token in cookies', () => {
        expect(true);
    });
});