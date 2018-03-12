import React from 'react';
import { shallow } from 'enzyme';

import Notification from 'components/Notifications/Notification/Notification';
import history from 'model/history';
jest.mock('model/history');

const shallowNotification = ({message, title, icon, type, redirectUrl}) => {
    return shallow(
        <Notification message={message} title={title} icon={icon} type={type} redirectUrl={redirectUrl}/>
    );
};

describe('Notification', () => {
    let NotificationComponent;
    const title = 'A title';
    const message = 'A message';
    const icon = 'fa fa-plug';
    const type = 'error';
    const redirectUrl = '/redirectUrl';

    beforeEach(() => {
        NotificationComponent = shallowNotification({message, title, icon, type, redirectUrl});
    });

    it('should render', () => {
        expect(NotificationComponent).toHaveLength(1);
    });

    it(`should set title to the title prop`, () => {
        expect(NotificationComponent.find('.title').text())
            .toBe(title);
    });

    it(`should set message to the message prop`, () => {
        expect(NotificationComponent.find('.message').text())
            .toBe(message);
    });

    it('should set the type to the type prop', () => {
        expect(NotificationComponent.find(`.${type}`).length)
            .toBe(1);
    });

    it('should set the icon to the icon prop', () => {
        expect(NotificationComponent.find(`.fa.fa-plug`).length)
            .toBe(1);
    });

    it('should redirect user to the redirectUrl passed in props when notification is clicked', () => {
        expect(history.push).not.toHaveBeenCalled();
        NotificationComponent.find('.Notification').simulate('click');
        expect(history.push).toHaveBeenCalledWith(redirectUrl);
    });
});