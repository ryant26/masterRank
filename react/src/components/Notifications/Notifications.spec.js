import React from 'react';
import { toast } from 'react-toastify';
jest.mock('react-toastify');

import Notification from './Notification/Notification';

import groupInvites from '../../resources/groupInvites';

import {
    joinGroupNotification,
    errorNotification,
    disconnectedNotification
} from './Notifications';


describe('Notifications', () => {

    describe('joinGroupNotification', () => {
        it('should call toast with correct props', () => {
            const displayName = groupInvites[0].leader.platformDisplayName.replace(/#.*/,"");
            const type = "success";
            const title = <span>You've joined <b>{displayName}'s</b> group!</span>;
            const message = <span>Add <b>{displayName}</b> while you wait for other players to join</span>;

            joinGroupNotification(displayName);

            expect(toast).toHaveBeenCalledWith(
                <Notification
                    icon="fa fa-thumbs-up"
                    title={title}
                    message={message}
                    type={type}
                />,
                {
                    autoClose: 30000,
                    className: "NotificationContainer",
                    progressClassName: `${type}-progress`
                }
            );
        });
    });

   describe('errorNotification with correct props', () => {
        it('should call toast ', () => {
            const type = "error";
            const title = "Something went wrong!";
            const errorMessage = 'Error adding hero "tracer", please try again or refresh page';

            errorNotification(errorMessage);

            expect(toast).toHaveBeenCalledWith(
                <Notification
                   icon="fa fa-exclamation"
                   title={title}
                   message={errorMessage}
                   type={type}
                />,
                {
                   autoClose: 30000,
                   className: "NotificationContainer",
                   progressClassName:`${type}-progress`
                }
            );
        });
   });

   describe('disconnectedNotification with correct props', () => {
       it('should call toast ', () => {
          const type = "warning";
          const message = "Please wait while we try to reconnect...";
          const title = "You have been disconnected";

          disconnectedNotification();

          expect(toast).toHaveBeenCalledWith(
              <Notification
                  icon="fa fa-plug"
                  title={title}
                  message={message}
                  type={type}
              />,
              {
                  autoClose: 30000,
                  className: "NotificationContainer",
                  progressClassName:`${type}-progress`
              }
          );
       });
  });
});