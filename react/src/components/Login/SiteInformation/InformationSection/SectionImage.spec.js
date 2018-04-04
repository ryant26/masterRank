import React from 'react';
import { shallow } from 'enzyme';

import SectionImage from 'components/Login/SiteInformation/InformationSection/SectionImage';

const getSectionImage = ({number = 1, imgName = 'someImg'} = {}) => {
    return shallow (
        <SectionImage number={number} imgName={imgName}/>
    );
};

describe('SectionImage', () => {
    let component;

    beforeEach(() => {
        component = getSectionImage();
    });

    it('should have the class info-[number]', () => {
        const number = 3;
        expect(component.find(`img > .info-${number}`)).toHaveLength(0);
        component = getSectionImage({number});
        expect(component.find(`img > .info-${number}`)).toHaveLength(0);
    });

    it('should have img alt attribute as img name', () => {
        const imgName = 'lfgImg';
        expect(component.find('img').first().props().alt).not.toEqual(imgName);
        component = getSectionImage({imgName});
        expect(component.find('img').first().props().alt).toEqual(imgName);
    });
});