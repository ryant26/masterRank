import React from 'react';
import { toast } from 'react-toastify';
jest.mock('react-toastify');

import Notification from './Notification/Notification';

import groupInvites from '../../resources/groupInvites';

import {
    joinGroupNotification,
    errorNotification
} from './Notifications';


describe('Notifications', () => {
    const displayName = groupInvites[0].leader.platformDisplayName;
    const error = 'Error adding hero "tracer", please try again or refresh page';

    describe('errorNotification', () => {
        it('should call toast with correct props', () => {
            joinGroupNotification(displayName);

            expect(toast).toHaveBeenCalledWith(
                <Notification
                    icon="fa fa-thumbs-up"
                    message={<span>Add <b>{displayName}</b> {`while you wait for other players to join`}</span>}
                    title={<span>{`You've joined `}<b>{displayName.replace(/#.*/,"")}{`'s`}</b>{` group!`}</span>}
                    type="success"
                />,
                {
                    autoClose: 30000,
                    className: "NotificationContainer",
                    progressClassName: "success-progress"
                }
            );
        });
    });

   describe('errorNotification with correct props', () => {
        it('should call toast ', () => {
           errorNotification(error);
           expect(toast).toHaveBeenCalledWith(
               <Notification
                   icon="fa fa-exclamation"
                   message={error}
                   title="Something went wrong!"
                   type="error"
               />,
               {
                   autoClose: 30000,
                   className: "NotificationContainer",
                   progressClassName: "error-progress"
               }
           );
        });
   });
});