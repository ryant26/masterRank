import React from 'react';
import { toast } from 'react-toastify';
jest.mock('react-toastify');

import JoinedGroup from './JoinedGroup/JoinedGroup';
import Error from './Error/Error';

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
                <JoinedGroup displayName={displayName}/>,
                {
                    autoClose: 30000,
                    className: "JoinedGroupContainer",
                    progressClassName: "JoinedProgress"
                }
            );
        });
    });

   describe('errorNotification with correct props', () => {
        it('should call toast ', () => {
           errorNotification(error);

           expect(toast).toHaveBeenCalledWith(
               <Error error={error}/>,
               {
                   autoClose: 30000,
                   className: "ErrorContainer",
                   progressClassName: "ErrorProgress"
               }
           );
        });
   });
});