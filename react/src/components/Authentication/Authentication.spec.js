import React from 'react';
import { shallow } from 'enzyme';

import Authentication from './Authentication';
import LoginPage from '../../pages/LoginPage/LoginPage';
import PlatformSelectionPage from '../../pages/PlatformSelectionPage/PlatformSelectionPage';
import Store from '../../model/store';

describe('Authentication', () => {
    let AuthenticationContainer;
    let AuthenticationComponent;


    beforeEach(function() {
        AuthenticationContainer = shallow(
            <Authentication store={Store} dispatch={jest.fn()} />
        );

        AuthenticationComponent = AuthenticationContainer.dive();
    });

    it('should render platform selection page when platform is undefined', () => {
        AuthenticationComponent.setProps({
            platform: undefined,
        });
        expect(AuthenticationComponent.find(PlatformSelectionPage)).toHaveLength(1);
        expect(AuthenticationComponent.find(LoginPage)).toHaveLength(0);
    });

    it('should render login page when state access token is undefined and platform is defined', () => {
        AuthenticationComponent.setState({
            accessToken: undefined,
        });
        AuthenticationComponent.setProps({
            platform: 'pc',
        });
        expect(AuthenticationComponent.find(PlatformSelectionPage)).toHaveLength(0);
        expect(AuthenticationComponent.find(LoginPage)).toHaveLength(1);
    });
});