import React from 'react';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import InvitesGrid from './InvitesGrid';
import groupInvites from '../../../resources/groupInvites';

const mockStore = configureStore();
const getStore = () => {
    return mockStore({
        group: groupInvites[1],
        groupInvites: groupInvites
    });
};

const shallowWithStore = (store=getStore()) => {
    return shallow(
        <Provider store={store}>
            <MemoryRouter>
                <InvitesGrid/>
            </MemoryRouter>
        </Provider>
    );
};

const renderWithStore = (store=getStore()) => {
    return renderer.create(
        <Provider store={store}>
            <MemoryRouter>
                <InvitesGrid/>
            </MemoryRouter>
        </Provider>
    );
};


describe('InvitesGrid Component', () => {
    it('should render without exploding', () => {
        const wrapper = shallowWithStore();
        const InvitesGridComponent = wrapper.find(InvitesGrid);
        expect(InvitesGridComponent).toBeTruthy();
    });

    it('should match the snapshot', () => {
        const component = renderWithStore();
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});