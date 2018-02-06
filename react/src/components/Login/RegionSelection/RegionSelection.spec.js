import React from 'react';
import { shallow } from 'enzyme';

import RegionSelection from './RegionSelection';

describe('RegionSelection', () => {
    let RegionSelectionComponent;
    let onClick = jest.fn();

    beforeEach(() => {
        RegionSelectionComponent = shallow(
            <RegionSelection onClick={onClick}/>
        );
    });

    it('should render', () => {
        expect(RegionSelectionComponent).toHaveLength(1);
    });

    it('should render 3 radio inputs with proper values when page loads', () => {
        expect(RegionSelectionComponent.find('input')).toHaveLength(3);
        expect(RegionSelectionComponent.find('input').at(0).html())
                    .toBe('<input type="radio" name="region" value="us" checked=""/>');
        expect(RegionSelectionComponent.find('input').at(1).html())
                    .toBe('<input type="radio" name="region" value="apac"/>');
        expect(RegionSelectionComponent.find('input').at(2).html())
                    .toBe('<input type="radio" name="region" value="eu"/>');
    });
});
