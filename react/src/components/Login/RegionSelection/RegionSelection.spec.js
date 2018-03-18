import React from 'react';
import { shallow } from 'enzyme';

import RegionSelection from 'components/Login/RegionSelection/RegionSelection';

const getRegionSelectionComponent = (selectedRegion) => {
    let onChange = jest.fn();

    return shallow(
       <RegionSelection onChange={onChange} selectedRegion={selectedRegion}/>
    );
};

describe('RegionSelection', () => {
    let RegionSelectionComponent;

    describe('when component renders', () => {
        const selectedRegion = 'us';

        beforeEach(() => {
            RegionSelectionComponent = getRegionSelectionComponent(selectedRegion);
        });

        it('should render', () => {
            expect(RegionSelectionComponent).toHaveLength(1);
        });

        it('us radio button should have value of us', () => {
            expect(RegionSelectionComponent.find('#region-us').prop('value')).toBe('us');
        });

        it('apac radio button should have value of apac', () => {
            expect(RegionSelectionComponent.find('#region-apac').prop('value')).toBe('apac');
        });

        it('eu radio button should have value of eu', () => {
            expect(RegionSelectionComponent.find('#region-eu').prop('value')).toBe('eu');
        });

        it('us radio button should have text NA', () => {
            expect(RegionSelectionComponent.find('.button-content').at(0).text()).toBe('NA');
        });

        it('apac radio button should have text NA', () => {
            expect(RegionSelectionComponent.find('.button-content').at(1).text()).toBe('APAC');
        });

        it('eu radio button should have text NA', () => {
            expect(RegionSelectionComponent.find('.button-content').at(2).text()).toBe('EU');
        });
    });

    describe('when selected region is us', () => {
        const selectedRegion = 'us';

        beforeEach(() => {
            RegionSelectionComponent = getRegionSelectionComponent(selectedRegion);
        });

        it('us checkbox should be checked', () => {
            expect(RegionSelectionComponent.find('#region-us').prop('checked')).toBe(true);
        });

        it('apac checkbox should not be checked', () => {
            expect(RegionSelectionComponent.find('#region-apac').prop('checked')).toBe(false);
        });

        it('eu checkbox should not be checked', () => {
            expect(RegionSelectionComponent.find('#region-eu').prop('checked')).toBe(false);
        });
    });

    describe('when selected region is apac', () => {
        const selectedRegion = 'apac';

        beforeEach(() => {
            RegionSelectionComponent = getRegionSelectionComponent(selectedRegion);
        });

        it('us checkbox should not be checked', () => {
            expect(RegionSelectionComponent.find('#region-us').prop('checked')).toBe(false);
        });

        it('apac checkbox should be checked', () => {
            expect(RegionSelectionComponent.find('#region-apac').prop('checked')).toBe(true);
        });

        it('eu checkbox should not be checked', () => {
            expect(RegionSelectionComponent.find('#region-eu').prop('checked')).toBe(false);
        });
    });

    describe('when selected region is eu', () => {
        const selectedRegion = 'eu';

        beforeEach(() => {
            RegionSelectionComponent = getRegionSelectionComponent(selectedRegion);
        });

        it('us checkbox should not be checked', () => {
            expect(RegionSelectionComponent.find('#region-us').prop('checked')).toBe(false);
        });

        it('apac checkbox should not be checked', () => {
            expect(RegionSelectionComponent.find('#region-apac').prop('checked')).toBe(false);
        });

        it('eu checkbox should be checked', () => {
            expect(RegionSelectionComponent.find('#region-eu').prop('checked')).toBe(true);
        });
    });
});
