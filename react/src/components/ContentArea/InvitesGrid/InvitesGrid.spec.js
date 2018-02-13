import React from 'react';
import { Provider } from 'react-redux';
import {MemoryRouter} from 'react-router-dom';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import InvitesGrid from './InvitesGrid';
import {createStore} from "../../../model/store";
import groupInvites from '../../../resources/groupInvites';
import {addGroupInvite} from "../../../actions/groupInvites";

const getStore = () => {
    let store = createStore();
    groupInvites.forEach((invite) => {
        store.dispatch(addGroupInvite(invite));
    });
    return store;
};

const mountWithStore = (store=getStore()) => {
    return mount(
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
        const wrapper = mountWithStore();
        const InvitesGridComponent = wrapper.find(InvitesGrid);
        expect(InvitesGridComponent).toBeTruthy();
    });

    it('should match the snapshot', () => {
        const component = renderWithStore();
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});