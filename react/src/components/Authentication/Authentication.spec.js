import React from 'react';
import { shallow } from 'enzyme';

import Authentication from './Authentication';
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

    it('should render platform selection page when state access token is undefined', () => {
        AuthenticationComponent.setState({
            accessToken: undefined,
        });

        expect(AuthenticationComponent.find(PlatformSelectionPage)).toHaveLength(1);
    });

    it('should not render platform selection page when state access token is defined', () => {
        AuthenticationComponent.setState({
            accessToken: 'mock_token',
        });
        expect(AuthenticationComponent.find(PlatformSelectionPage)).toHaveLength(0);
    });
});