import React from 'react';
import { shallow } from 'enzyme';

import Authentication from './Authentication';
import PlatformSelection from '../PlatformSelection/PlatformSelection';
import RegionSelection from '../RegionSelection/RegionSelection';
import Store from '../../../model/store';

describe('Authentication', () => {
    let AuthenticationContainer;
    let AuthenticationComponent;


    beforeEach(function() {
        AuthenticationContainer = shallow(
            <Authentication store={Store} dispatch={jest.fn()} />
        );

        AuthenticationComponent = AuthenticationContainer.dive();
    });

    it('should render region selection page when region is undefined', () => {
        AuthenticationComponent.setProps({
            region: undefined,
        });
        expect(AuthenticationComponent.find(RegionSelection)).toHaveLength(1);
        expect(AuthenticationComponent.find(PlatformSelection)).toHaveLength(0);
    });

    it('should render platform selection page when state access token is undefined and region is defined', () => {
        AuthenticationComponent.setState({
            accessToken: undefined,
        });
        AuthenticationComponent.setProps({
            region: 'us',
        });
        expect(AuthenticationComponent.find(PlatformSelection)).toHaveLength(1);
        expect(AuthenticationComponent.find(RegionSelection)).toHaveLength(0);
    });

    it('should not render platform selection page when state access token is defined', () => {
        AuthenticationComponent.setState({
            accessToken: 'mock_token',
        });
        expect(AuthenticationComponent.find(PlatformSelection)).toHaveLength(0);
    });
});