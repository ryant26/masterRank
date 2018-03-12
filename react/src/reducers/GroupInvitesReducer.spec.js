import GroupInvitesReducer from 'reducers/GroupInvitesReducer';
import Invites from 'resources/groupInvites';
import * as actionTypes from 'actiontypes/groupInvites';


describe('Group Invite Reducer', () => {
    const initialState = [];
    const invite1 = Invites[0];
    const invite2 = Invites[1];

    it ('should have default initial state when passed undefined', () => {
        expect(GroupInvitesReducer(undefined, {})).toEqual(initialState);
    });

    describe('when action type is ADD_GROUP_INVITE', () => {
        let newState;

        beforeEach(() => {
            newState = [...initialState, invite1];
        });

        it ('should add new invite to state', () => {
            expect(initialState.length).toBe(0);
            expect(GroupInvitesReducer(initialState, {
                type: actionTypes.ADD_GROUP_INVITE,
                invite: invite1
            })).toEqual(newState);
            expect(newState.length).toBe(1);
        });

        it ('should not add duplicate invite to state', () => {
            expect(newState[0].groupId).toBe(invite1.groupId);
            expect(newState.length).toBe(1);
            expect(GroupInvitesReducer(newState, {
                type: actionTypes.ADD_GROUP_INVITE,
                invite: invite1
            })).toEqual(newState);
            expect(newState.length).toBe(1);
        });

        it ('should add multiple invites to state', () => {
            expect(invite1.groupId).not.toBe(invite2.groupId);
            let currentState = [invite1];
            newState = [...currentState, invite2];

            expect(GroupInvitesReducer(currentState, {
                type: actionTypes.ADD_GROUP_INVITE,
                invite: invite2
            })).toEqual(newState);
            expect(newState.length).toBe(2);
        });
    });

    describe('when action type is REMOVE_GROUP_INVITE', () => {
        let currentState;

        beforeEach(() => {
            currentState = [...initialState, invite1];
        });

        it ('should remove invite with matching groupId from state', () => {
            expect(currentState.length).toBe(1);
            expect(currentState[0].groupId).toBe(invite1.groupId);
            expect(GroupInvitesReducer(currentState, {
                type: actionTypes.REMOVE_GROUP_INVITE,
                invite: invite1
            })).toEqual(initialState);
            expect(initialState.length).toBe(0);
        });

        it ('should not remove invite with non-matching groupId from state', () => {
            expect(currentState.length).toBe(1);
            expect(currentState[0].groupId).not.toBe(invite2.groupId);
            expect(GroupInvitesReducer(currentState, {
                type: actionTypes.REMOVE_GROUP_INVITE,
                invite: invite2
            })).toEqual(currentState);
            expect(currentState.length).toBe(1);
        });
    });
});