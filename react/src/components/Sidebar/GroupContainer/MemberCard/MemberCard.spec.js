import React from 'react';
import { mount } from 'enzyme';

import MemberCard from './MemberCard';
import HeroImage from '../../../HeroImage/HeroImage';
import MemberCardInfo from './MemberCardInfo/MemberCardInfo';
import Module from '../../../../model/model';

import groupInvites from '../../../../resources/groupInvites';


const getMemberCardComponent = (member, number, pending, leader) => {
    return mount (
        <MemberCard
            member={member}
            number={number}
            pending={pending}
            leader={leader}
        />
    );
};

describe('MemberCard', () => {
    let MemberCardComponent;
    const member = groupInvites[0].members[0];
    const number = 1;
    const pending = true;
    const leader = false;
    const inviteTimeout = 30;

    beforeEach(() => {
        MemberCardComponent = getMemberCardComponent(member, number, pending, leader);
    });

    describe('should render', () => {
        it('when component loads', () => {
            expect(MemberCardComponent).toHaveLength(1);
        });

        it('HeroImage with correct props  when component loads', () => {
            expect(MemberCardComponent.find(HeroImage)).toHaveLength(1);
            expect(MemberCardComponent.find(HeroImage).props().heroName).toBe(member.heroName);
        });

        it('MemberCard with correct props when component loads', () => {
            expect(MemberCardComponent.find(MemberCardInfo)).toHaveLength(1);
            expect(MemberCardComponent.find(MemberCardInfo).props().platformDisplayName).toBe(member.platformDisplayName);
            expect(MemberCardComponent.find(MemberCardInfo).props().heroName).toBe(member.heroName);
            expect(MemberCardComponent.find(MemberCardInfo).props().pending).toBe(pending);
            expect(MemberCardComponent.find(MemberCardInfo).props().leader).toBe(leader);
        });

        it('className overlay when component loads', () => {
            expect(MemberCardComponent.find('.overlay')).toHaveLength(1);
        });

        it('className pending when props pending is true and not render it when false', () => {
            expect(MemberCardComponent.find('.pending')).toHaveLength(1);
            MemberCardComponent.setProps({
                pending: false
            });
            expect(MemberCardComponent.find('.pending')).toHaveLength(0);
        });

        it('the correct number when component loads', () => {
            expect(MemberCardComponent.find('.numberBox').text()).toBe(`${number}`);
        });

        it(`initialize timeout to ${inviteTimeout} when component loads`, () => {
            expect(MemberCardComponent.state().inviteTimeoutSeconds).toBe(inviteTimeout);
        });

        it('invite timeout equal to state.inviteTimeoutSeconds', () => {
            let timeout = 5;
            MemberCardComponent.setState({
                inviteTimeoutSeconds: timeout
            });
            expect(MemberCardComponent.find('.countdown-container').text())
                .toBe(`${timeout}`);
        });
    });

    describe('when component will mount', () => {

        it('should call setInterval()', () => {
            jest.useFakeTimers()
            expect(setInterval.mock.calls.length).toBe(0);
            MemberCardComponent = getMemberCardComponent(member, number, pending, leader);
            expect(setInterval.mock.calls.length).toBe(1);
        });
    });

    describe('when component will unmount', () => {

        it('should call clearInterval()', () => {
            jest.useFakeTimers()
            MemberCardComponent = getMemberCardComponent(member, number, pending, leader);
            expect(clearInterval.mock.calls.length).toBe(0);
            MemberCardComponent.unmount();
            expect(clearInterval.mock.calls.length).toBe(1);
        });
    });

    describe(`when timer runs for ${inviteTimeout} seconds`, () => {

        it('should cancel invite and call clear interval timer', () => {
            Module.cancelInvite = jest.fn();
            jest.useFakeTimers();
            MemberCardComponent = getMemberCardComponent(member, number, pending, leader);

            expect(Module.cancelInvite).not.toHaveBeenCalled();
            expect(clearInterval).not.toHaveBeenCalled();
            expect(MemberCardComponent.state().inviteTimeoutSeconds).toBe(inviteTimeout);

            jest.runAllTimers();
            expect(MemberCardComponent.state().inviteTimeoutSeconds).toBe(0);
            expect(Module.cancelInvite).toHaveBeenCalledWith({
                platformDisplayName: member.platformDisplayName,
                heroName: member.heroName
            });
            expect(clearInterval).toHaveBeenCalled();
        });
    });
});