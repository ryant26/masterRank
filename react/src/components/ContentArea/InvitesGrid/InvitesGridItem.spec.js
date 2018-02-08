import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import InvitesGridItem from './InvitesGridItem';
import groupInvites from '../../../resources/groupInvites';

describe('InvitesGridItem Component', () => {
    it('should render without exploding', () => {
        const wrapper = mount(
            <InvitesGridItem invite={groupInvites[0]}/>
        );
        const InvitesGridComponent = wrapper.find(InvitesGridItem);
        expect(InvitesGridComponent).toBeTruthy();
    });

    it('should match the snapshot', () => {
        const component = renderer.create(
            <InvitesGridItem invite={groupInvites[0]}/>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should show the correct group SR', () => {
        const wrapper = mount(
            <InvitesGridItem invite={groupInvites[0]}/>
        );

        expect(wrapper.find('.groupSR').text()).toEqual('2700 Group SR');
    });

    it('should show SR without the comma when < 1000', () => {
        const groupInvite = {
            groupId: 10,
            groupSize: 2,
            inviteDate: new Date(),
            leader: {
                platformDisplayName: "luckbomb#1234",
                skillRating: 900,
                heroName: "genji",
                stats: {}
            },
            members: [],
            pending: []
        };

        const wrapper = mount(
            <InvitesGridItem invite={groupInvite}/>
        );

        expect(wrapper.find('.groupSR').text()).toEqual('900 Group SR');
    });
});