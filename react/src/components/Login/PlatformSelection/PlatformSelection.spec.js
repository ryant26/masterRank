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

    it('should render 3 radio inputs with proper values when page loads', () => {
        expect(PlatformSelectionComponent.find('input')).toHaveLength(3);
        expect(PlatformSelectionComponent.find('input').at(0).html())
                    .toBe('<input type="radio" name="platform" value="pc" checked=""/>');
        expect(PlatformSelectionComponent.find('input').at(1).html())
                    .toBe('<input type="radio" name="platform" value="xbl"/>');
        expect(PlatformSelectionComponent.find('input').at(2).html())
                    .toBe('<input type="radio" name="platform" value="psn"/>');
    });
});
