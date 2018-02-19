import React from 'react';
import { shallow } from 'enzyme';

import Notification from './Notification';

const shallowNotification = ({message, title, icon, type}) => {
    return shallow(
        <Notification message={message} title={title} icon={icon} type={type}/>
    );
};

describe('Notification', () => {
    let NotificationComponent;
    const title = 'A title';
    const message = 'A message';
    const icon = 'fa fa-plug';
    const type = 'error';

    beforeEach(() => {
        NotificationComponent = shallowNotification({message, title, icon, type});
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
});