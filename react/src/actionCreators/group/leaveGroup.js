import { successfullyLeftGroupNotification } from '../../components/Notifications/Notifications';
import { initializeGroup as initializeGroupAction} from './group';

export const leaveGroup = (socket) => {

    return (dispatch, getState) => {
        const user = getState().user;
        const group = getState().group;

        if( group.leader.platformDisplayName === user.platformDisplayName && group.members.length > 0 ) {
            successfullyLeftGroupNotification(group.leader.platformDisplayName);
        }

        dispatch(initializeGroupAction());
        socket.groupLeave();
    };
};
