import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import InvitesGridItem from 'components/ContentArea/InvitesGrid/InvitesGridItem';
import HeroCard from 'components/ContentArea/DashboardHome/HeroRoles/HeroCard/HeroCard';


import Model from 'model/model';
import groupInvites from 'resources/groupInvites';
import { users } from 'resources/users';


const mockStore = configureStore();
const shallowInvitesGridItem = (groupInvite) => {
    let store = mockStore({
        group: groupInvite,
        user: users[0]
    });

    return shallow(
        <InvitesGridItem invite={groupInvite} store={store}/>
    );
};

describe('InvitesGridItem', () => {
    const groupInvite = groupInvites[0];
    let wrapper;

    it('should match the snapshot', () => {
        let store = mockStore({
            group: groupInvite,
            user: users[0]
        });
        const component = renderer.create(
            <Provider  store={store}>
                <InvitesGridItem invite={groupInvite}/>
            </Provider>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should render when mounted', () => {
        wrapper = shallowInvitesGridItem(groupInvite);
        expect(wrapper).toHaveLength(1);
    });

    describe('when passed groupInvite with 1x leader, 2x members, 3x pending', () => {
        const groupInvite1L2M3P = groupInvites[3];
        const leader = groupInvite1L2M3P.leader;
        const members = groupInvite1L2M3P.members;
        const pendingMembers = groupInvite1L2M3P.pending;
        let leaderCount = 1;
        let membersCount = 2;
        let pendingMembersCount = 3;

        const validateHeroCardProps = (hero, i) => {
            expect(wrapper.find(HeroCard).at(i).props().hero).toBe(hero);
            expect(wrapper.find(HeroCard).at(i).props().invitable).toBe(false);
        };
        beforeEach(() => {
            wrapper = shallowInvitesGridItem(groupInvite1L2M3P);
        });

        it('groupInvite should have 2 members, 3 pending', () => {
            expect(membersCount).toBe(groupInvite1L2M3P.members.length);
            expect(pendingMembersCount).toBe(groupInvite1L2M3P.pending.length);
        });

        it('should mount hero card for leader with correct props', () => {
            validateHeroCardProps(leader, 0);
        });

        it('should mount hero card for each member with correct props', () => {
            members.forEach((member, i) => {
                validateHeroCardProps(member, (i+leaderCount));
            });
        });

        it('should mount hero card for each pending member with correct props', () => {
            pendingMembers.forEach((member, i) => {
                validateHeroCardProps(member, (i+leaderCount+membersCount));
            });
        });
    });

    it('should show the correct group SR', () => {
        wrapper = shallowInvitesGridItem(groupInvite);
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

        wrapper = shallowInvitesGridItem(groupInvite);
        expect(wrapper.find('.groupSR').text()).toEqual('900 Group SR');
    });

    describe('when accept button is clicked', () => {

        beforeEach(() => {
            Model.leaveGroup = jest.fn();
            Model.acceptGroupInviteAndRemoveFromStore = jest.fn();
            wrapper = shallowInvitesGridItem(groupInvite);
            expect(Model.leaveGroup).not.toHaveBeenCalled();
            expect(Model.acceptGroupInviteAndRemoveFromStore).not.toHaveBeenCalled();
            wrapper.find('.button-secondary').simulate('click');
        });

        it('should call Model.leaveGroup ', () => {
            expect(Model.leaveGroup).toHaveBeenCalled();
        });

        it('should call Model.acceptGroupInviteAndRemoveFromStore with group id', () => {
            expect(Model.acceptGroupInviteAndRemoveFromStore).toHaveBeenCalledWith(groupInvite);
        });
    });

    it('should call Model.declineGroupInviteAndRemoveFromStore when decline button is clicked', () => {
        Model.declineGroupInviteAndRemoveFromStore = jest.fn();
        const wrapper = shallowInvitesGridItem(groupInvite);
        wrapper.find('.button-six').simulate('click');
        expect(Model.declineGroupInviteAndRemoveFromStore).toHaveBeenCalledWith(groupInvite);
    });
});