import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import GroupContainer from 'components/Sidebar/GroupContainer/GroupContainer';
import MemberCard from 'components/Sidebar/GroupContainer/MemberCard/MemberCard';
import Modal from "components/Modal/Modal";
import GroupStatsContainer from 'components/Stats/GroupStatsContainer';
import LeaveGroupButton from 'components/Sidebar/GroupContainer/LeaveGroupButton/LeaveGroupButton';
import { viewTeamStatsTrackingEvent } from 'actionCreators/googleAnalytic/googleAnalytic';
jest.mock('actionCreators/googleAnalytic/googleAnalytic');

import { initialGroup, groupInvites } from 'resources/groupInvites';
import { users } from 'resources/users';

const mockStore = configureStore();

const shallowGroupContainerComponent = (group, preferredHeroes, user) => {
    let store = mockStore({
        group: group,
        preferredHeroes: preferredHeroes,
        user: user,
    });
    store.dispatch = jest.fn();
    return shallow(
        <GroupContainer store={store}/>
    );
};

describe('GroupContainer', () => {
    let wrapper;
    let GroupContainerComponent;
    const group = groupInvites[0];
    const user = users[0];
    const preferredHeroes = {
        heroes: [
            "genji",
            "tracer",
            "winston"
        ]
    };

    describe('when component loads', () => {

        beforeEach(() => {
            wrapper = shallowGroupContainerComponent(group, preferredHeroes, user);
            GroupContainerComponent = wrapper.dive();
        });

        it('should render', () => {
            expect(GroupContainerComponent).toHaveLength(1);
        });

        it('should not show Modal', () => {
            expect(GroupContainerComponent.find(Modal).prop('modalOpen')).toBe(false);
        });

        describe('when store.group is set', () => {
            it('should render Team Stats button', () => {
                expect(GroupContainerComponent.find('.button-content')).toHaveLength(1);
                expect(GroupContainerComponent.find('.button-content').text()).toBe('Team Stats');
            });

            describe('when team stats is clicked', () => {

                afterEach(() => {
                    viewTeamStatsTrackingEvent.mockClear();
                });

                it('should dispatch viewTeamStatsTrackingEvent', () => {
                    expect(viewTeamStatsTrackingEvent).not.toHaveBeenCalled();
                    GroupContainerComponent.find('.button-four').simulate('click');
                    expect(viewTeamStatsTrackingEvent).toHaveBeenCalledWith(user.platformDisplayName);
                });
            });
        });

        it('when Modal is not showing should show Modal when Team Stats button is clicked', () => {
            expect(GroupContainerComponent.find(Modal).prop('modalOpen')).toBe(false);
            GroupContainerComponent.find('.button-four').simulate('click');
            expect(GroupContainerComponent.find(Modal).prop('modalOpen')).toBe(true);
        });

        it('should render GroupStatsContainer with correct props', () => {
            expect(GroupContainerComponent.find(GroupStatsContainer)).toHaveLength(1);
            expect(GroupContainerComponent.find(GroupStatsContainer).prop('group')).toBe(group);
            expect(GroupContainerComponent.find(GroupStatsContainer).prop('isLeading')).toBe(true);
        });
    });

    describe("when user's group is an initialGroup ", () => {
        beforeEach(() => {
            wrapper = shallowGroupContainerComponent(initialGroup, preferredHeroes, user);
            GroupContainerComponent = wrapper.dive();
        });

        it('should not render Team Stats button', () => {
            expect(GroupContainerComponent.find('.button-content')).toHaveLength(0);
        });

        it('should not mount LeaveGroupButton when their are no group member excluding leader', () => {
            expect(wrapper.props().group.members.length).toBe(0);
            expect(GroupContainerComponent.find(LeaveGroupButton)).toHaveLength(0);
        });
    });
    const testMemberCardProps = (user, member, isLeader, isPending, number) => {
        let index = number - 1;
        let isUser = user.platformDisplayName === member.platformDisplayName;
        expect(GroupContainerComponent.find(MemberCard).at(index).prop('isUser')).toBe(isUser);
        expect(GroupContainerComponent.find(MemberCard).at(index).prop('member')).toBe(member);
        expect(GroupContainerComponent.find(MemberCard).at(index).prop('isLeader')).toBe(isLeader);
        expect(GroupContainerComponent.find(MemberCard).at(index).prop('isPending')).toBe(isPending);
        expect(GroupContainerComponent.find(MemberCard).at(index).prop('number')).toBe(number);
        //TODO: key is very important but react is not really made in  away that is convenient to test key.
//        expect(GroupContainerComponent.find(MemberCard).at(index).key)
//            .toBe([member.platformDisplayName,member.heroName]);
    };

    describe('when given a group of 3 with 1 leader, 1 member, and 1 pending', () => {
        const threeStack = groupInvites[0];
        const leader = threeStack.leader;
        const member = threeStack.members[0];
        const pendingMember = threeStack.pending[0];

        beforeEach(() => {
            wrapper = shallowGroupContainerComponent(threeStack, preferredHeroes, user);
            GroupContainerComponent = wrapper.dive();
        });

        it('should render 3 MemberCard ', () => {
            expect(GroupContainerComponent.find(MemberCard)).toHaveLength(3);
        });

        it('should render leader\'s MemberCard with the correct props', () => {
            testMemberCardProps(user, leader, true, false, 1);
        });

        it('should render member\'s MemberCard with the correct props', () => {
            testMemberCardProps(user, member, false, false, 2);
        });

        it('should render pending member\'s MemberCard with the correct props', () => {
            testMemberCardProps(user, pendingMember, false, true, 3);
        });

        it('should mount LeaveGroupButton when their is at least 1 group member excluding leader', () => {
            expect(wrapper.props().group.members.length).toBeGreaterThan(0);
            expect(GroupContainerComponent.find(LeaveGroupButton)).toHaveLength(1);
        });
    });

    describe('when given a group of 6 with 1 leader, 2 member, and 3 pending', () => {
        const sixStack = groupInvites[3];
        const leader = sixStack.leader;
        const members = sixStack.members;
        const pendingMembers = sixStack.pending;

        beforeEach(() => {
            wrapper = shallowGroupContainerComponent(sixStack, preferredHeroes, user);
            GroupContainerComponent = wrapper.dive();
        });

        it('should render 6 MemberCard ', () => {
            expect(GroupContainerComponent.find(MemberCard)).toHaveLength(6);
        });

        it('should render leader\'s MemberCard with the correct props', () => {
            testMemberCardProps(user, leader, true, false, 1);
        });

        it('should render members\' MemberCards with the correct props', () => {
            expect(members).toHaveLength(2);
            members.forEach((member, i) => {
                testMemberCardProps(user, member, false, false, (i + 2));
            });
        });

        it('should render pending members\' MemberCards with the correct props', () => {
            expect(pendingMembers).toHaveLength(3);
            pendingMembers.forEach((member, i) => {
                testMemberCardProps(user, member, false, true, (i + 4));
            });
        });
    });
});