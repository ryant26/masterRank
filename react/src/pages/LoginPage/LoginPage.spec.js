import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import LoginPage from './LoginPage';
import PlatformSelection from 'components/Login/PlatformSelection/PlatformSelection';
import RegionSelection from 'components/Login/RegionSelection/RegionSelection';
import BlizzardOAuth from 'components/Login/BlizzardOAuth/BlizzardOAuth';
import ConsoleUserSearch from 'components/Login/ConsoleUserSearch/ConsoleUserSearch';

describe('Login Page', () => {
    const mockStore = configureStore();
    let LoginPageComponent;

    beforeEach(() => {
        let store = mockStore({
            dispatch: {
                updateRegionAction: jest.fn()
            }
        });
        LoginPageComponent = shallow(
            <LoginPage store={store}/>
        ).dive();
    });

    it('should render when component loads', () => {
        expect(LoginPageComponent).toHaveLength(1);
    });

    it('should render with className equal to LoginPage when component loads', () => {
        expect(LoginPageComponent.find('.LoginPage')).toHaveLength(1);
    });

    it('should render PlatformSelection with prop onClick equal to this.onPlatformChange when component loads', () => {
        expect(LoginPageComponent.find(PlatformSelection)).toHaveLength(1);
        expect(LoginPageComponent.find(PlatformSelection).props().onChange)
            .toBe(LoginPageComponent.instance().onPlatformChange);
    });

    it('should render RegionSelection with prop onClick equal to this.onRegionChange when component loads', () => {
        expect(LoginPageComponent.find(RegionSelection)).toHaveLength(1);
        expect(LoginPageComponent.find(RegionSelection).props().onChange)
            .toBe(LoginPageComponent.instance().onRegionChange);
    });

    it('should render BlizzardOAuth with props region equal to eu when state platform is pc and region is eu', () => {
        LoginPageComponent.setState({
            platform: 'pc',
            region: 'eu'
        });
        expect(LoginPageComponent.find(BlizzardOAuth)).toHaveLength(1);
        expect(LoginPageComponent.find(BlizzardOAuth).props().region).toBe('eu');

    });

    it('should not render ConsoleUserSearch when state.platform is pc', () => {
        LoginPageComponent.setState({
            platform: 'pc'
        });
        expect(LoginPageComponent.find(ConsoleUserSearch)).toHaveLength(0);
    });

    it('should not render BlizzardOAuth when state.platform is not pc', () => {
        LoginPageComponent.setState({
            platform: 'xbl'
        });
        expect(LoginPageComponent.find(BlizzardOAuth)).toHaveLength(0);
    });

    it('should render ConsoleUserSearch with props platform equal to xbl when state platform is xbl', () => {
        LoginPageComponent.setState({
            platform: 'xbl'
        });
        expect(LoginPageComponent.find(ConsoleUserSearch)).toHaveLength(1);
        expect(LoginPageComponent.find(ConsoleUserSearch).props().platform).toBe('xbl');
    });
});