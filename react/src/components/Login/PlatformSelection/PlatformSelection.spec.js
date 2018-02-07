import React from 'react';
import { shallow } from 'enzyme';

import PlatformSelection from './PlatformSelection';

describe('PlatformSelection', () => {
    let PlatformSelectionComponent;
    let onClick = jest.fn();

    beforeEach(() => {
        PlatformSelectionComponent = shallow(
            <PlatformSelection onClick={onClick}/>
        );
    });

    it('should render', () => {
        expect(PlatformSelectionComponent).toHaveLength(1);
    });

    it('should render plat-1 input and label text when page loads', () => {
        expect(PlatformSelectionComponent.find('input').at(0).html())
            .toBe('<input type="radio" id="plat-1" name="platform" value="pc" checked=""/>');
        expect(PlatformSelectionComponent.find('label').at(0).text()).toBe('Battle.net');
    });

    it('should render plat-2 input and label text when page loads', () => {
        expect(PlatformSelectionComponent.find('input').at(1).html())
            .toBe('<input type="radio" id="plat-2" name="platform" value="psn"/>');
        expect(PlatformSelectionComponent.find('label').at(1).text()).toBe('PSN');
    });

    it('should render plat-3 input and label text when page loads', () => {
        expect(PlatformSelectionComponent.find('input').at(2).html())
            .toBe('<input type="radio" id="plat-3" name="platform" value="xbl"/>');
        expect(PlatformSelectionComponent.find('label').at(2).text()).toBe('XBL');
    });
});


