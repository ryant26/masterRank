import React from 'react';
import { toast } from 'react-toastify';

import Notification from './Notification/Notification';

const showNotification = ({icon, message, title, type}) => {
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
        message: <span>Add <b>{displayName}</b> {`while you wait for other players to join`}</span>,
        title: <span>{`You've joined `}<b>{leaderName}{`'s`}</b>{` group!`}</span>,
        type: 'success'
    });
};

export const errorNotification = ( error ) => {
    showNotification({
        icon: 'fa fa-exclamation',
        message: error,
        title: 'Something went wrong!',
        type: 'error'
    });
};

export const disconnectedNotification = ( ) => {
    showNotification({
        icon: 'fa fa-plug',
        message: 'Please wait while we try to reconnect...',
        title: 'You have been disconnected',
        type: 'warning'
    });
};