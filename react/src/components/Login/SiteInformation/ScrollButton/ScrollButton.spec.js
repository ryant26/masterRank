import React from 'react';
import { shallow } from 'enzyme';

import ScrollButton from 'components/Login/SiteInformation/ScrollButton/ScrollButton';

describe('ScrollButton', () => {
    let component;

    beforeEach(() => {

    });

    describe('onClick', () => {
        it('should  scroll to the information section', () => {
            let scrollIntoView = jest.fn();

            Object.defineProperty(document, 'getElementsByClassName', {
                writable: true,
                value: jest.fn(() => [{scrollIntoView}])
            });

            component = shallow(
                <ScrollButton/>
            );

            expect(document.getElementsByClassName).not.toHaveBeenCalled();

            component.find('img').simulate('click');

            expect(document.getElementsByClassName).toHaveBeenCalledWith('InformationSection');
            expect(scrollIntoView).toHaveBeenCalled();
        });
    });
});