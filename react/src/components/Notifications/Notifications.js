import React from 'react';
import { toast } from 'react-toastify';
import JoinedGroup from './JoinedGroup';
import Error from './Error';

export const joinGroupNotification = () => {
    toast(<JoinedGroup/>, {
        autoClose: 15000,
        className: "JoinedGroupContainer",
        progressClassName: "JoinedProgress"
    });
};

export const errorNotification = () => {
    toast(<Error/>, {
        autoClose: 15000,
        className: "ErrorContainer",
        progressClassName: "ErrorProgress"
    });
}