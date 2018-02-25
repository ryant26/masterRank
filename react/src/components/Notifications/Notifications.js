import React from 'react';
import { toast } from 'react-toastify';

import Notification from './Notification/Notification';
import { allInvites } from '../Routes/links';

const inviteTimeout = 30;

const showNotification = ({icon, title, message, type, redirectUrl}) => {
    toast(<Notification icon={icon} message={message} title={title} type={type} redirectUrl={redirectUrl}/>, {
        autoClose: 30000,
        className: "NotificationContainer",
        progressClassName: `${type}-progress`
    });
};

export const leaderLeftGroupNotification = ( newLeaderDisplayName ) => {
    showNotification({
        icon: 'fa fa-group',
        title: `Group leader left your group`,
        message: `${newLeaderDisplayName} has been promoted to leader`,
        type: 'success'
    });
};

export const successfullyLeftGroupNotification = ( leaderDisplayName ) => {
    showNotification({
        icon: 'fa fa-thumbs-up',
        title: "Successfully left group",
        message: `You've left ${leaderDisplayName}'s group`,
        type: 'success'
    });
};

export const inviteSentNotification = ( inviteeDisplayName ) => {
    showNotification({
        icon: 'fa fa-envelope',
        title: `Invite sent to ${inviteeDisplayName}`,
        message: `Sent group invite to ${inviteeDisplayName}, invite will expire in ${inviteTimeout} seconds`,
        type: 'success'
    });
};

export const inviteReceivedNotification = ( invitorDisplayName ) => {
    showNotification({
        icon: 'fa fa-envelope',
        title: `Invite from ${invitorDisplayName}`,
        message: `You received an invite from ${invitorDisplayName}, this invite will expire in ${inviteTimeout} seconds`,
        type: 'success',
        redirectUrl: allInvites
    });
};

export const joinedGroupNotification = ( groupLeaderGamerTag ) => {
    const leaderDisplayName = groupLeaderGamerTag.replace(/#.*/,"");

    showNotification({
        icon: 'fa fa-thumbs-up',
        title: `You've joined ${leaderDisplayName}'s group`,
        message: `Add ${groupLeaderGamerTag} to join their party in Overwatch`,
        type: 'success'
    });
};

export const userJoinedGroupNotification = ( memberDisplayName ) => {
    showNotification({
        icon: 'fa fa-group',
        title: `${memberDisplayName} joined group`,
        message: `you can now invite ${memberDisplayName} in Overwatch`,
        type: 'success'
    });
};

export const preferredHeroNotification = (heroName ) => {
    showNotification({
        icon: 'fa fa-thumbs-up',
        title: `Successfully preferred ${heroName}`,
        message:  "Other players will see your top 5 preferred Heroes, which at anytime you can change from the sidebar",
        type: 'success'
    });
};

export const errorNotification = ( errorMessage ) => {
    errorMessage = errorMessage ? errorMessage : "please refresh the page";

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