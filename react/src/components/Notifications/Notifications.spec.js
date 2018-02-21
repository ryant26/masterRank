import React from 'react';
import { toast } from 'react-toastify';
jest.mock('react-toastify');

import Notification from './Notification/Notification';

import groupInvites from '../../resources/groupInvites';

import {
    joinGroupNotification,
    inviteNotification,
    errorNotification,
    disconnectedNotification
} from './Notifications';


describe('Notifications', () => {

    describe('joinGroupNotification', () => {
        it('should call toast with correct props', () => {
            const displayName = groupInvites[0].leader.platformDisplayName.replace(/#.*/,"");
            const icon="fa fa-thumbs-up";
            const title = <span>You've joined <b>{displayName}'s</b> group!</span>;
            const message = <span>Add <b>{displayName}</b> while you wait for other players to join</span>;
            const type = "success";

            joinGroupNotification(displayName);

            expect(toast).toHaveBeenCalledWith(
                <Notification
                    icon={icon}
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

    describe('inviteNotification with correct props', () => {
        it('should call toast ', () => {
            const inviteeDisplayName = groupInvites[0].leader.platformDisplayName;
            const icon="fa fa-user-plus";
            const title = `Invite sent to ${inviteeDisplayName}`;
            const message = 'You should see an invite timeout at the bottom left side of your screen';
            const type = "success";

            inviteNotification(inviteeDisplayName);

            expect(toast).toHaveBeenCalledWith(
                <Notification
                    icon={icon}
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

    describe('errorNotification with correct props', () => {
        it('should call toast ', () => {
            const icon="fa fa-exclamation";
            const title = "Something went wrong!";
            const errorMessage = 'Error adding hero "tracer", please try again or refresh page';
            const type = "error";

            errorNotification(errorMessage);

            expect(toast).toHaveBeenCalledWith(
                <Notification
                   icon={icon}
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
          const icon="fa fa-plug";
          const title = "You have been disconnected";
          const message = "Please wait while we try to reconnect...";
          const type = "warning";

          disconnectedNotification();

          expect(toast).toHaveBeenCalledWith(
              <Notification
                  icon={icon}
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