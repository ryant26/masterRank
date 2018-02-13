import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import Model from '../../../model/model';
import GroupContainer from './GroupContainer';
import MemberCard from './MemberCard/MemberCard';
import Modal from "../../Modal/Modal";
import GroupStatsContainer from "../../Stats/GroupStatsContainer";

import groupInvites from '../../../resources/groupInvites';
import { users } from '../../../resources/users';

const mockStore = configureStore();
const getGroupContainerComponent = (group, preferredHeroes, user) => {
    let store = mockStore({
        group: group,
        preferredHeroes: preferredHeroes,
        user: user,
    });
    return shallow(
        <GroupContainer store={store}/>
    ).dive();
};

describe('GroupContainer', () => {
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

    describe('when component unmounts', () => {

        it('should call Model.leaveGroup', () => {
            Model.leaveGroup = jest.fn();
            GroupContainerComponent = getGroupContainerComponent(group, preferredHeroes, user);
            expect(Model.leaveGroup).not.toHaveBeenCalled();
            GroupContainerComponent.unmount();
            expect(Model.leaveGroup).toHaveBeenCalledWith(group.groupId);
        });
    });

    describe('when component loads', () => {

        beforeEach(() => {
            GroupContainerComponent = getGroupContainerComponent(group, preferredHeroes, user);
        });

        it('should render', () => {
            expect(GroupContainerComponent).toHaveLength(1);
        });

        it('should render Team Stats button', () => {
            expect(GroupContainerComponent.find('.button-content').text()).toBe('Team Stats');
        });

        it('should not show Modal', () => {
            expect(GroupContainerComponent.find(Modal).prop('modalOpen')).toBe(false);
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
            expect(GroupContainerComponent.find(GroupStatsContainer).prop('toggleModal'))
                .toBe(GroupContainerComponent.instance().toggleModal);
        });
    });

    const testMemberCardProps = (member, leader, pending, number) => {
        let index = number - 1;
        expect(GroupContainerComponent.find(MemberCard).at(index).prop('member')).toBe(member);
        expect(GroupContainerComponent.find(MemberCard).at(index).prop('leader')).toBe(leader);
        expect(GroupContainerComponent.find(MemberCard).at(index).prop('pending')).toBe(pending);
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
            GroupContainerComponent = getGroupContainerComponent(threeStack, preferredHeroes, user);
        });

        it('should render 3 MemberCard ', () => {
            expect(GroupContainerComponent.find(MemberCard)).toHaveLength(3);
        });

        it('should render leader\'s MemberCard with the correct props', () => {
            testMemberCardProps(leader, true, false, 1);
        });

        it('should render member\'s MemberCard with the correct props', () => {
            testMemberCardProps(member, false, false, 2);
        });

        it('should render pending member\'s MemberCard with the correct props', () => {
            testMemberCardProps(pendingMember, false, true, 3);
        });
    });

    describe('when given a group of 6 with 1 leader, 2 member, and 3 pending', () => {
        const sixStack = groupInvites[3];
        const leader = sixStack.leader;
        const members = sixStack.members;
        const pendingMembers = sixStack.pending;

        beforeEach(() => {
            GroupContainerComponent = getGroupContainerComponent(sixStack, preferredHeroes, user);
        });

        it('should render 6 MemberCard ', () => {
            expect(GroupContainerComponent.find(MemberCard)).toHaveLength(6);
        });

        it('should render leader\'s MemberCard with the correct props', () => {
            testMemberCardProps(leader, true, false, 1);
        });

        it('should render members\' MemberCards with the correct props', () => {
            expect(members).toHaveLength(2);
            members.forEach((member, i) => {
                testMemberCardProps(member, false, false, (i + 2));
            });
        });

        it('should render pending members\' MemberCards with the correct props', () => {
            expect(pendingMembers).toHaveLength(3);
            pendingMembers.forEach((member, i) => {
                testMemberCardProps(member, false, true, (i + 4));
            });
        });
    });
});