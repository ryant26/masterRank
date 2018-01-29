import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import InvitesGrid from './InvitesGrid';
import {createStore} from "../../../model/store";
import groupInvites from '../../../resources/groupInvites';
import {addGroupInvite} from "../../../actions/groupInvites";
import {MemoryRouter} from 'react-router-dom';

const getStore = () => {
    let store = createStore();
    groupInvites.forEach((invite) => {
        store.dispatch(addGroupInvite(invite));
    });
    return store;
};

const mountWithStore = (store=getStore()) => {
    return mount(
        <MemoryRouter>
            <InvitesGrid store={store}/>
        </MemoryRouter>
    );
};

const renderWithStore = (store=getStore()) => {
    return renderer.create(
        <MemoryRouter>
            <InvitesGrid store={store}/>
        </MemoryRouter>
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