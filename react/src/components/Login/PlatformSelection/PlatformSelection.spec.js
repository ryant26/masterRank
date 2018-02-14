import React from 'react';
import { shallow } from 'enzyme';

import PlatformSelection from './PlatformSelection';

const getPlatformSelectionComponent = (selectedPlatform) => {
    let onChange = jest.fn();

    return shallow(
       <PlatformSelection onChange={onChange} selectedPlatform={selectedPlatform}/>
    );
};

describe('PlatformSelection', () => {
    let PlatformSelectionComponent;

    describe('when component renders', () => {
        const selectedPlatform = 'pc';

        beforeEach(() => {
            PlatformSelectionComponent = getPlatformSelectionComponent(selectedPlatform);
        });

        it('should render', () => {
            expect(PlatformSelectionComponent).toHaveLength(1);
        });

        it('pc radio button should have value of pc', () => {
            expect(PlatformSelectionComponent.find('#platform-pc').prop('value')).toBe('pc');
        });

        it('psn radio button should have value of psn', () => {
            expect(PlatformSelectionComponent.find('#platform-psn').prop('value')).toBe('psn');
        });

        it('xbl radio button should have value of xbl', () => {
            expect(PlatformSelectionComponent.find('#platform-xbl').prop('value')).toBe('xbl');
        });

        it('pc radio button should have text Battle.net', () => {
            expect(PlatformSelectionComponent.find('.button-content').at(0).text()).toBe('Battle.net');
        });

        it('psn radio button should have text PSN', () => {
            expect(PlatformSelectionComponent.find('.button-content').at(1).text()).toBe('PSN');
        });

        it('xbl radio button should have text XBL', () => {
            expect(PlatformSelectionComponent.find('.button-content').at(2).text()).toBe('XBL');
        });
    });

    describe('when selected platform is pc', () => {
        const selectedPlatform = 'pc';

        beforeEach(() => {
            PlatformSelectionComponent = getPlatformSelectionComponent(selectedPlatform);
        });

        it('pc checkbox should be checked', () => {
            expect(PlatformSelectionComponent.find('#platform-pc').prop('checked')).toBe(true);
        });

        it('psn checkbox should not be checked', () => {
            expect(PlatformSelectionComponent.find('#platform-psn').prop('checked')).toBe(false);
        });

        it('xbl checkbox should not be checked', () => {
            expect(PlatformSelectionComponent.find('#platform-xbl').prop('checked')).toBe(false);
        });
    });

    describe('when selected platform is psn', () => {
        const selectedPlatform = 'psn';

        beforeEach(() => {
            PlatformSelectionComponent = getPlatformSelectionComponent(selectedPlatform);
        });

        it('pc checkbox should not be checked', () => {
            expect(PlatformSelectionComponent.find('#platform-pc').prop('checked')).toBe(false);
        });

        it('psn checkbox should be checked', () => {
            expect(PlatformSelectionComponent.find('#platform-psn').prop('checked')).toBe(true);
        });

        it('xbl checkbox should not be checked', () => {
            expect(PlatformSelectionComponent.find('#platform-xbl').prop('checked')).toBe(false);
        });
    });

    describe('when selected platform is xbl', () => {
        const selectedPlatform = 'xbl';

        beforeEach(() => {
            PlatformSelectionComponent = getPlatformSelectionComponent(selectedPlatform);
        });

        it('pc checkbox should not be checked', () => {
            expect(PlatformSelectionComponent.find('#platform-pc').prop('checked')).toBe(false);
        });

        it('psn checkbox should not be checked', () => {
            expect(PlatformSelectionComponent.find('#platform-psn').prop('checked')).toBe(false);
        });

        it('xbl checkbox should be checked', () => {
            expect(PlatformSelectionComponent.find('#platform-xbl').prop('checked')).toBe(true);
        });
    });
});


