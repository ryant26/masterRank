import React from 'react';
import { shallow } from 'enzyme';

import MemberCardInfo from 'components/Sidebar/GroupContainer/MemberCard/MemberCardInfo/MemberCardInfo';
import groupInvites from 'resources/groupInvites';

const getMemberCardInfoComponent = (member, isPending, isLeader) => {
    return shallow (
        <MemberCardInfo
            platformDisplayName={member.platformDisplayName}
            heroName={member.heroName}
            isPending={isPending}
            isLeader={isLeader}
        />
    );
};

describe('MemberCardInfo', () => {
    let MemberCardInfoComponent;
    const member = groupInvites[0].members[0];

    beforeEach(() => {
        MemberCardInfoComponent = getMemberCardInfoComponent(member);
    });

    it('should render when component loads', () => {
        expect(MemberCardInfoComponent).toHaveLength(1);
    });

    it('should render member\'s heroName when component loads', () => {
        expect(MemberCardInfoComponent.find('.hero-name').text()).toBe(member.heroName);
    });

    it('should not render member\'s displayName when component loads', () => {
        expect(MemberCardInfoComponent.find('.display-name').text()).toBe(`${member.platformDisplayName}`);
    });

    it('should render member\'s displayName + " - Pending" when prop isPending is true', () => {
        let isPending = true;
        MemberCardInfoComponent = getMemberCardInfoComponent(member, isPending);
        expect(MemberCardInfoComponent.find('.display-name').text()).toBe(`${member.platformDisplayName} - Pending`);
    });

    it('should render member\'s displayName + " - Leader" when prop isLeader is true and pending is fasly', () => {
        let isPending = false;
        let isLeader = true;
        MemberCardInfoComponent = getMemberCardInfoComponent(member, isPending, isLeader);
        expect(MemberCardInfoComponent.find('.display-name').text()).toBe(`${member.platformDisplayName} - Leader`);
    });
});