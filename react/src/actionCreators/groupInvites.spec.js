import * as GroupInvitesActionType from '../actiontypes/groupInvites';
import * as GroupInviteActionCreators from './groupInvites';
import Invite from '../resources/groupInvites';

describe('add Group Invites', () => {
  it ('should create the ADD_GROUP_INVITE action', () => {
    expect(GroupInviteActionCreators.addGroupInvite(Invite))
      .toEqual({
        type: GroupInvitesActionType.ADD_GROUP_INVITE,
        invite: Invite
      });
  });
});

describe('remove Group Invites', () => {
  it ('should create the REMOVE_GROUP_INVITE action', () => {
    expect(GroupInviteActionCreators.removeGroupInvite(Invite))
      .toEqual({
        type: GroupInvitesActionType.REMOVE_GROUP_INVITE,
        invite: Invite
      });
  });
});