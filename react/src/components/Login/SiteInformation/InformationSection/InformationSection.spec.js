import React from 'react';
import { shallow } from 'enzyme';

import InformationSection from 'components/Login/SiteInformation/InformationSection/InformationSection';
import SectionImage from 'components/Login/SiteInformation/InformationSection/SectionImage';


const getInformationSection = ({sectionNumber = 1, title = 'title', button = 'button', imgName = 'imgName', children = <div/>} = {}) => {
    return shallow (
        <InformationSection sectionNumber={sectionNumber} title={title} button={button} imgName={imgName}>
            {children}
        </InformationSection>
    );
};

describe('InformationSection', () => {
    let component;

    beforeEach(() => {
        component = getInformationSection();
    });

    it('should pass the right props to section image', () => {
        const sectionNumber = 2;
        const imgName = 'lfgImg';

        let sectionImage = component.find(SectionImage);
        expect(sectionImage.props().number).not.toEqual(sectionNumber);
        expect(sectionImage.props().imgName).not.toEqual(imgName);

        component = getInformationSection({sectionNumber, imgName});

        sectionImage = component.find(SectionImage);

        expect(sectionImage.props().number).toEqual(sectionNumber);
        expect(sectionImage.props().imgName).toEqual(imgName);
    });

    it('should contain the title', () => {
        const title = 'My Title';
        expect(component.find('h2').text()).not.toEqual(title);
        component = getInformationSection({title});
        expect(component.find('h2').text()).toEqual(title);
    });

    it('should contain the children', () => {
        const nodeText = 'I am a child element';
        const children = <div className="test-child">{nodeText}</div>;
        expect(component.find('.test-child')).toHaveLength(0);

        component = getInformationSection({children});

        expect(component.find('.test-child')).toHaveLength(1);
        expect(component.find('.test-child').text()).toEqual(nodeText);
    });

    it('should have the right button text', () => {
        const button = 'My button text';
        expect(component.find('.button-content').text()).not.toEqual(button);
        component = getInformationSection({button});
        expect(component.find('.button-content').text()).toEqual(button);
    });

    it('picture should be in the DOM before children when number is odd', () => {
        expect(component.childAt(0).find(SectionImage)).toHaveLength(1);
        expect(component.childAt(0).find('.section-text')).toHaveLength(0);

        expect(component.childAt(1).find(SectionImage)).toHaveLength(0);
        expect(component.childAt(1).find('.section-text')).toHaveLength(1);
    });

    it('picture should be in the DOM after children when number is even', () => {
        const sectionNumber = 2;
        component = getInformationSection({sectionNumber});

        expect(component.childAt(0).find(SectionImage)).toHaveLength(0);
        expect(component.childAt(0).find('.section-text')).toHaveLength(1);

        expect(component.childAt(1).find(SectionImage)).toHaveLength(1);
        expect(component.childAt(1).find('.section-text')).toHaveLength(0);
    });
});