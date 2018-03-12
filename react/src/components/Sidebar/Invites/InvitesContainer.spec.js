import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import INVITES from 'resources/groupInvites';
import configureStore from 'redux-mock-store';
import {MemoryRouter} from 'react-router-dom';

import InvitesContainer from 'components/Sidebar/Invites/InvitesContainer';

const mockStore = configureStore();

const renderWithStore = (store) => {
    return renderer.create(
        <MemoryRouter>
            <InvitesContainer store={store}/>
        </MemoryRouter>
    );
};

describe('HeroCard Component',()=> {
    let store;

    beforeEach(() => {
        store = mockStore({groupInvites: INVITES});
    });

    it('should render without exploding', () => {
        const wrapper = mount(
            <MemoryRouter>
                <InvitesContainer store={store}/>
            </MemoryRouter>
        );

        const InvitesContainerComponent = wrapper.find(InvitesContainer);
        expect(InvitesContainerComponent).toBeTruthy();
    });

    it('should render a single invite', () => {
        store = mockStore({groupInvites: [INVITES[0]]});
        const component = renderWithStore(store);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should render two invites', () => {
        store = mockStore({groupInvites: [INVITES[0], INVITES[1]]});
        const component = renderWithStore(store);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should render three invites', () => {
        store = mockStore({groupInvites: [INVITES[0], INVITES[1], INVITES[2]]});
        const component = renderWithStore(store);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

});