import React from 'react';
import { shallow } from 'enzyme';

import Store from '../../../model/store';
import Authentication from './Authentication';
import LoginPage from '../../../pages/LoginPage/LoginPage';

describe('Authentication', () => {
    let AuthenticationContainer;
    let AuthenticationComponent;


    beforeEach(function() {
        AuthenticationContainer = shallow(
            <Authentication store={Store} dispatch={jest.fn()} />
        );

        AuthenticationComponent = AuthenticationContainer.dive();
    });

    it('should render login page when state access token is undefined', () => {
        AuthenticationComponent.setState({
            accessToken: undefined,
        });

        expect(AuthenticationComponent.find(LoginPage)).toHaveLength(1);
    });

    it('should not render login page when state access token is defined', () => {
        AuthenticationComponent.setState({
            accessToken: 'mock_token',
        });
        expect(AuthenticationComponent.find(LoginPage)).toHaveLength(0);
    });
});