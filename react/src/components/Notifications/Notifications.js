import React from 'react';
import { toast } from 'react-toastify';

import Notification from './Notification/Notification';

const showNotification = ({icon, title, message, type}) => {
    toast(<Notification icon={icon} message={message} title={title} type={type}/>, {
        autoClose: 30000,
        className: "NotificationContainer",
        progressClassName: `${type}-progress`
    });
};

export const joinGroupNotification = ( displayName ) => {
    const leaderName = displayName.replace(/#.*/,"");
    showNotification({
        icon: 'fa fa-thumbs-up',
        title: <span>You've joined <b>{leaderName}'s</b> group!</span>,
        message: <span>Add <b>{displayName}</b> while you wait for other players to join</span>,
        type: 'success'
    });
};

export const inviteNotification = ( inviteeDisplayName ) => {
    showNotification({
        icon: 'fa fa-user-plus',
        title: `Invite sent to ${inviteeDisplayName}`,
        message: 'You should see an invite timeout at the bottom left side of your screen',
        type: 'success'
    });
};

export const errorNotification = ( errorMessage ) => {
    showNotification({
        icon: 'fa fa-exclamation',
        title: 'Something went wrong!',
        message: errorMessage,
        type: 'error'
    });
};

export const disconnectedNotification = ( ) => {
    showNotification({
        icon: 'fa fa-plug',
        title: 'You have been disconnected',
        message: 'Please wait while we try to reconnect...',
        type: 'warning'
    });
};