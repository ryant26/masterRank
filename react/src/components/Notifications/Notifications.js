import React from 'react';
import { toast } from 'react-toastify';

import JoinedGroup from './JoinedGroup/JoinedGroup';
import Error from './Error/Error';
import Disconnected from './Disconnected/Disconnected';

export const joinGroupNotification = ( displayName ) => {
    toast(<JoinedGroup displayName={displayName}/>, {
        autoClose: 30000,
        className: "JoinedGroupContainer",
        progressClassName: "JoinedProgress"
    });
};

export const errorNotification = ( error ) => {
    toast(<Error error={error}/>, {
        autoClose: 30000,
        className: "ErrorContainer",
        progressClassName: "ErrorProgress"
    });
};

export const disconnectedNotification = ( ) => {
    toast(<Disconnected/>, {
        autoClose: 30000,
        className: "DisconnectedContainer",
        progressClassName: "DisconnectedProgress"
    });
};