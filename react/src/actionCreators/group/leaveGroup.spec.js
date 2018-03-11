import { getMockSocket, mockGetState, generateMockUser } from '../../utilities/test/mockingUtilities';

import { successfullyLeftGroupNotification } from '../../components/Notifications/Notifications';
jest.mock('../../components/Notifications/Notifications');

import { initializeGroup as initializeGroupAction } from './group';
jest.mock('./group');

import { leaveGroup } from './leaveGroup';

describe('leaveGroup', () => {
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
            return leaveGroup(socket)(dispatch, getState);
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
            return leaveGroup(socket)(dispatch, getState);
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
});