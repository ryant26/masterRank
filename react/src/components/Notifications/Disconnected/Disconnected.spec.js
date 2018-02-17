import React from 'react';
import { shallow } from 'enzyme';

import Disconnected from './Disconnected';

const shallowDisconnected = () => {
    return shallow(
        <Disconnected/>
    );
};

describe('JoinGroup', () => {
    let DisconnectedComponent;

    beforeEach(() => {
        DisconnectedComponent = shallowDisconnected();
    });

    it('should render', () => {
        expect(DisconnectedComponent).toHaveLength(1);
    });

    it(`should set title to "You have been disconnected"`, () => {
        expect(DisconnectedComponent.find('.title').text())
            .toBe("You have been disconnected");
    });

    it(`should set message to "Refresh the page to reconnect"`, () => {
        expect(DisconnectedComponent.find('.message').text())
            .toBe("Refresh the page to reconnect");
    });
});