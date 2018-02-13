import React from 'react';
import { shallow } from 'enzyme';

import MemberCardInfo from './MemberCardInfo';
import groupInvites from '../../../../../resources/groupInvites';

const getMemberCardInfoComponent = (member, pending, leader) => {
    return shallow (
        <MemberCardInfo
            platformDisplayName={member.platformDisplayName}
            heroName={member.heroName}
            pending={pending}
            leader={leader}
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

    it('should render member\'s displayName + " - Pending" when prop pending is true', () => {
        let pending = true;
        MemberCardInfoComponent = getMemberCardInfoComponent(member, pending);
        expect(MemberCardInfoComponent.find('.display-name').text()).toBe(`${member.platformDisplayName} - Pending`);
    });

    it('should render member\'s displayName + " - Leader" when prop leader is true and pending is fasly', () => {
        let pending = false;
        let leader = true;
        MemberCardInfoComponent = getMemberCardInfoComponent(member, pending, leader);
        expect(MemberCardInfoComponent.find('.display-name').text()).toBe(`${member.platformDisplayName} - Leader`);
    });
});