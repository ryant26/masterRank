import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import INVITES from '../../../resources/groupInvites';
import configureStore from 'redux-mock-store';

import InvitesContainer from './InvitesContainer';

const mockStore = configureStore();

describe('HeroCard Component',()=> {
    let store;

    beforeEach(() => {
        store = mockStore({groupInvites: INVITES});
    });

    it('should render without exploding', () => {
        const wrapper = mount(
            <InvitesContainer store={store}/>
        );

        const InvitesContainerComponent = wrapper.find(InvitesContainer);
        expect(InvitesContainerComponent).toBeTruthy();
    });

    it('should render a single invite', () => {
        const component = renderer.create(
            <InvitesContainer store={store}/>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should render two invites', () => {
        const component = renderer.create(
            <InvitesContainer store={store}/>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should render three invites', () => {
        const component = renderer.create(
            <InvitesContainer store={store}/>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

});