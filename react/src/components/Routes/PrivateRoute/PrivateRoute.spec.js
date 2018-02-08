import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import {MemoryRouter} from 'react-router-dom';
import configureStore from 'redux-mock-store';


import PrivateRoute from './PrivateRoute';
import Authentication from '../../Login/Authentication/Authentication';
import Title from '../../Sidebar/Title/Title';
import { users as arrayUsers} from '../../../resources/users';

const getPrivateRouteComponent = (component, user) => {
    let mockStore = configureStore();
    let store = mockStore({});
    return mount(
        <Provider  store={store}>
            <MemoryRouter>
                <PrivateRoute component={component} user={user}/>
            </MemoryRouter>
        </Provider>
    );
};

describe('PrivateRoute', () => {
    let PrivateRouteComponent;

    beforeEach(() => {
        PrivateRouteComponent = getPrivateRouteComponent(Title, arrayUsers[0]);
    });

    it('should render when component loads', () => {
        expect(PrivateRouteComponent).toHaveLength(1);
    });

    it('should render Route when component loads', () => {
        expect(PrivateRouteComponent.find(Route)).toHaveLength(1);
    });

    it('should render the Title component passed in props when user is defined', () => {
        expect(PrivateRouteComponent.find(Title)).toHaveLength(1);
    });

    it('should render Authentication component when user is not defined', () => {
        PrivateRouteComponent = getPrivateRouteComponent(Title, undefined);
        expect(PrivateRouteComponent.find(Authentication)).toHaveLength(1);
    });
});