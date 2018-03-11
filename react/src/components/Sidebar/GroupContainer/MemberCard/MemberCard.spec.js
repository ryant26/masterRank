import React from 'react';
import { mount } from 'enzyme';

import MemberCard from './MemberCard';
import HeroImage from 'components/Images/HeroImage/HeroImage';
import MemberCardInfo from './MemberCardInfo/MemberCardInfo';
import Module from 'model/model';

import groupInvites from 'resources/groupInvites';


const getMemberCardComponent = (member, number, isPending, isLeader, isUser=false) => {
    return mount (
        <MemberCard
            member={member}
            number={number}
            isPending={isPending}
            isLeader={isLeader}
            isUser={isUser}
        />
    );
};

describe('MemberCard', () => {
    let MemberCardComponent;
    const member = groupInvites[0].members[0];
    const number = 1;
    const isPending = true;
    const isLeader = false;
    const inviteTimeout = 30;

    const testMemberCardProps = (member, isLeader, isPending, isUser) => {
        let displayName = member.platformDisplayName;
        if(isUser) {
            displayName = 'You';
        }
        expect(MemberCardComponent.find(MemberCardInfo)).toHaveLength(1);
        expect(MemberCardComponent.find(MemberCardInfo).props().platformDisplayName).toBe(displayName);
        expect(MemberCardComponent.find(MemberCardInfo).props().heroName).toBe(member.heroName);
        expect(MemberCardComponent.find(MemberCardInfo).props().isLeader).toBe(isLeader);
        expect(MemberCardComponent.find(MemberCardInfo).props().isPending).toBe(isPending);
    };

    beforeEach(() => {
        MemberCardComponent = getMemberCardComponent(member, number, isPending, isLeader);
    });

    describe('should render', () => {
        it('when component loads', () => {
            expect(MemberCardComponent).toHaveLength(1);
        });

        it('HeroImage with correct props  when component loads', () => {
            expect(MemberCardComponent.find(HeroImage)).toHaveLength(1);
            expect(MemberCardComponent.find(HeroImage).props().heroName).toBe(member.heroName);
        });

        describe('MemberCard with correct props when component loads and group member', () => {
            it('is user', () => {
                MemberCardComponent.setProps({
                    isUser: true
                });
                expect(MemberCardComponent.props().isUser).toBeTruthy();
                testMemberCardProps(member, isLeader, isPending, MemberCardComponent.props().isUser);
            });

            it('is not user', () => {
                expect(MemberCardComponent.props().isUser).toBeFalsy();
                testMemberCardProps(member, isLeader, isPending, MemberCardComponent.props().isUser);
            });
        });


        it('className overlay when component loads', () => {
            expect(MemberCardComponent.find('.overlay')).toHaveLength(1);
        });

        it('className pending when props isPending is true and not render it when false', () => {
            expect(MemberCardComponent.find('.pending')).toHaveLength(1);
            MemberCardComponent.setProps({
                isPending: false
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

        it('should set timer to null when is not pending', () => {
            MemberCardComponent = getMemberCardComponent(member, number, false, isLeader);
            expect(MemberCardComponent.state().timer).toBe(null);
        });

        it('should set timer to  when is not pending', () => {
            jest.useFakeTimers();
            MemberCardComponent = getMemberCardComponent(member, number, isPending, isLeader);
            expect(MemberCardComponent.state().timer).not.toBe(null);
        });

        it('should call setInterval() when is pending', () => {
            jest.useFakeTimers();
            expect(setInterval.mock.calls.length).toBe(0);
            MemberCardComponent = getMemberCardComponent(member, number, isPending, isLeader);
            expect(setInterval.mock.calls.length).toBe(1);
        });
    });

    describe('when component will unmount', () => {

        it('should call clearInterval()', () => {
            jest.useFakeTimers();
            MemberCardComponent = getMemberCardComponent(member, number, isPending, isLeader);
            expect(clearInterval.mock.calls.length).toBe(0);
            MemberCardComponent.unmount();
            expect(clearInterval.mock.calls.length).toBe(1);
        });
    });

    describe(`when timer runs for ${inviteTimeout} seconds`, () => {

        it('should cancel invite and call clear interval timer', () => {
            Module.cancelInvite = jest.fn();
            jest.useFakeTimers();
            MemberCardComponent = getMemberCardComponent(member, number, isPending, isLeader);

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