import { successfullyLeftGroupNotification } from '../../components/Notifications/Notifications';
import { initializeGroup as initializeGroupAction} from './group';

export const leaveGroup = (socket) => {

    return (dispatch, getState) => {
        const user = getState().user;
        const group = getState().group;

        if( !(isLeaderOfEmptyGroup(user, group)) ) {
            successfullyLeftGroupNotification(group.leader.platformDisplayName);
        }

        dispatch(initializeGroupAction());
        socket.groupLeave();
    };
};

const isLeaderOfEmptyGroup = (user, group) => {
    return user.platformDisplayName  ===  group.leader.platformDisplayName && group.members.length === 0;
}