import React from 'react';
import { toast } from 'react-toastify';
jest.mock('react-toastify');

import Notification from 'components/Notifications/Notification/Notification';
import { allInvites } from 'components/Routes/links';

import groupInvites from 'resources/groupInvites';

import {
    inviteSentNotification,
    inviteReceivedNotification,
    joinedGroupNotification,
    userJoinedGroupNotification,
    leaderLeftGroupNotification,
    successfullyLeftGroupNotification,
    preferredHeroNotification,
    errorNotification,
    disconnectedNotification,
    autoPreferredNotification,
} from 'components/Notifications/Notifications';


describe('Notifications', () => {
    const inviteTimeout = 30;

    describe('inviteSentNotification with correct props', () => {
        it('should call toast ', () => {
            const inviteeDisplayName = groupInvites[0].leader.platformDisplayName;
            const icon="fa fa-envelope";
            const title = `Invite sent to ${inviteeDisplayName}`;
            const message = `Sent group invite to ${inviteeDisplayName}, invite will expire in ${inviteTimeout} seconds`;
            const type = "success";

            inviteSentNotification(inviteeDisplayName);

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

    describe('inviteReceivedNotification with correct props', () => {
        it('should call toast ', () => {
            const invitorDisplayName = groupInvites[0].leader.platformDisplayName;
            const icon="fa fa-envelope";
            const title = `Invite from ${invitorDisplayName}`;
            const message = `You received an invite from ${invitorDisplayName}, this invite will expire in ${inviteTimeout} seconds`;
            const type = "success";
            const redirectUrl = allInvites;

            inviteReceivedNotification(invitorDisplayName);

            expect(toast).toHaveBeenCalledWith(
                <Notification
                    icon={icon}
                    title={title}
                    message={message}
                    type={type}
                    redirectUrl={redirectUrl}
                />,
                {
                    autoClose: 30000,
                    className: "NotificationContainer",
                    progressClassName:`${type}-progress`
                }
            );
        });
    });

    describe('joinedGroupNotification with correct props', () => {
        it('should call toast ', () => {
            const groupLeaderGamerTag = groupInvites[0].leader.platformDisplayName;
            const leaderDisplayName = groupLeaderGamerTag.replace(/#.*/,"");
            const icon="fa fa-thumbs-up";
            const title = `You've joined ${leaderDisplayName}'s group`;
            const message = `Add ${groupLeaderGamerTag} to join their party in Overwatch`;
            const type = "success";

            joinedGroupNotification(groupLeaderGamerTag);

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

    describe('userJoinedGroupNotification to leader with correct props', () => {
        it('should call toast ', () => {
            const memberDisplayName = groupInvites[0].members[0].platformDisplayName;
            const icon="fa fa-group";
            const title = `${memberDisplayName} joined group`;
            const message = `you can now invite ${memberDisplayName} in Overwatch`;
            const type = "success";

            userJoinedGroupNotification(memberDisplayName);

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

    describe('successfullyLeftGroupNotification as leader with correct props', () => {
        it('should call toast ', () => {
            const leaderDisplayName = groupInvites[0].leader;
            const icon="fa fa-thumbs-up";
            const title = "Successfully left group";
            const message = `You've left ${leaderDisplayName}'s group`;
            const type = "success";

            successfullyLeftGroupNotification(leaderDisplayName);

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

    describe('leaderLeftGroupNotification as leader with correct props', () => {
        it('should call toast ', () => {
            const newLeaderDisplayName = groupInvites[0].members[0];
            const icon="fa fa-group";
            const title = `Group leader left your group`;
            const message = `${newLeaderDisplayName} has been promoted to leader`;
            const type = "success";

            leaderLeftGroupNotification(newLeaderDisplayName);

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

    describe('preferredHeroNotification to leader with correct props', () => {
        it('should call toast ', () => {
            const heroName = groupInvites[0].leader.heroName;
            const icon="fa fa-thumbs-up";
            const title = `Successfully preferred ${heroName}`;
            const message = "Other players will see your top 5 preferred Heroes, which at anytime you can change from the sidebar";
            const type = "success";

            preferredHeroNotification(heroName);

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

    describe('autoPreferredNotification to leader with correct props', () => {
        it('should call toast ', () => {
            const icon="fa fa-graduation-cap";
            const title = "Getting started";
            const message = "We took the liberty to auto prefer your 5 most played heroes, which can be changed  at anytime from the sidebar."
                          + " Your preferred heroes will be shown to others users and represent the heroes you are willing to play.";
            const type = "informational";

            autoPreferredNotification();

            expect(toast).toHaveBeenCalledWith(
                <Notification
                    icon={icon}
                    title={title}
                    message={message}
                    type={type}
                />,
                {
                    autoClose: false,
                    className: "NotificationContainer",
                    progressClassName:`${type}-progress`
                }
            );
        });
    });

    describe('errorNotification with correct props', () => {
        it('should call toast when error message is defined', () => {
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

        it('should call toast when error message is null', () => {
            const icon="fa fa-exclamation";
            const title = "Something went wrong!";
            const errorMessage = null;
            const type = "error";

            errorNotification(errorMessage);

            expect(toast).toHaveBeenCalledWith(
                <Notification
                   icon={icon}
                   title={title}
                   message="please refresh the page"
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
          const title = "You've been disconnected";
          const message = "You were disconnected, please wait while we try to reconnect...";
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