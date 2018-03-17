import { getMockSocket, mockGetState, generateMockUser } from 'utilities/test/mockingUtilities';

import { successfullyLeftGroupNotification } from 'components/Notifications/Notifications';
jest.mock('components/Notifications/Notifications');

import { initializeGroup as initializeGroupAction } from 'actionCreators/group/group';
jest.mock('actionCreators/group/group');

import { leaveGroupAsync } from 'actionCreators/group/leaveGroupAsync';

describe('leaveGroupAsync', () => {
    const user = generateMockUser();
    let dispatch;
    let socket;
    let getState;

    beforeEach(() => {
        dispatch = jest.fn();
        socket = getMockSocket();
    });

    afterEach(() => {
        successfullyLeftGroupNotification.mockClear();
        initializeGroupAction.mockClear();
    });

    describe('when user is leader of a group with no members', () => {

        beforeEach(() => {
            getState = mockGetState({
                user,
                group: {
                    leader: user,
                    members: []
                }
            });
            return leaveGroupAsync(socket)(dispatch, getState);
        });

        it('should not call successfullyLeftGroupNotification when leader of group with no members', () => {
            expect(successfullyLeftGroupNotification).not.toHaveBeenCalled();
        });

        it('should set store group to initial state', () => {
            expect(initializeGroupAction).toHaveBeenCalled();
        });

        it('should call websocket.leaveGroup', () => {
            expect(socket.groupLeave).toHaveBeenCalled();
        });
    });

    describe('when user is leader of a group with at least 1 member', () => {

        beforeEach(() => {
            getState = mockGetState({
                user,
                group: {
                    leader: user,
                    members: [generateMockUser()]
                }
            });
            return leaveGroupAsync(socket)(dispatch, getState);
        });

        it('should call successfullyLeftGroupNotification with user platform display name when in a group with at least 1 member', () => {
            expect(successfullyLeftGroupNotification).toHaveBeenCalledWith(user.platformDisplayName);
        });

        it('should set store group to initial state', () => {
            expect(initializeGroupAction).toHaveBeenCalled();
        });

        it('should call websocket.leaveGroup', () => {
            expect(socket.groupLeave).toHaveBeenCalled();
        });
    });

    describe('when user is a member of a group', () => {
        const leader = generateMockUser('not user');
        beforeEach(() => {
            getState = mockGetState({
                user,
                group: {
                    leader: leader,
                    members: [user]
                }
            });
            return leaveGroupAsync(socket)(dispatch, getState);
        });

        it("should call successfullyLeftGroupNotification with leader's platform display name", () => {
            expect(successfullyLeftGroupNotification).toHaveBeenCalledWith(leader.platformDisplayName);
        });

        it('should set store group to initial state', () => {
            expect(initializeGroupAction).toHaveBeenCalled();
        });

        it('should call websocket.leaveGroup', () => {
            expect(socket.groupLeave).toHaveBeenCalled();
        });
    });
});