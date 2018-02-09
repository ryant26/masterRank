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

    it('should render radio region-1 input and label text when page loads', () => {
        expect(RegionSelectionComponent.find('input').at(0).html())
            .toBe('<input type="radio" id="region-1" name="region" value="us"/>');
        expect(RegionSelectionComponent.find('label').at(0).text()).toBe('NA');
    });

    it('should render radio region-2 input and label text when page loads', () => {
        expect(RegionSelectionComponent.find('input').at(1).html())
            .toBe('<input type="radio" id="region-2" name="region" value="apac"/>');
        expect(RegionSelectionComponent.find('label').at(1).text()).toBe('APAC');
    });

    it('should render radio region-1 input and label text when page loads', () => {
        expect(RegionSelectionComponent.find('input').at(2).html())
            .toBe('<input type="radio" id="region-3" name="region" value="eu"/>');
        expect(RegionSelectionComponent.find('label').at(2).text()).toBe('EU');
    });
});
