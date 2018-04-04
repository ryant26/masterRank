import React from 'react';
import PropTypes from 'prop-types';

import SectionImage from 'components/Login/SiteInformation/InformationSection/SectionImage';

const InformationSection = ({sectionNumber, title, button, imgName, children}) => {

    const scrollToTop = () => {
       document.querySelector('.LoginPage .background').scrollIntoView({
           block: 'start',
           behavior: 'smooth'
       });
    };

    return (
        <div className="InformationSection flex justify-center align-center">
            {sectionNumber % 2 === 1 ? <SectionImage number={sectionNumber} imgName={imgName}/> : undefined}
            <div className="flex section-content flex-column">
                <div className="section-title">
                    <div className="section-title-number">{sectionNumber}</div>
                    <div className="section-title-text">
                        <h2>{title}</h2>
                    </div>
                </div>
                <div className="section-text">
                    {children}
                </div>
                <div className="button-primary flex align-center justify-center" onClick={scrollToTop}>
                    <div className="button-content">
                        {button}
                    </div>
                </div>
            </div>
            {sectionNumber % 2 === 0 ? <SectionImage number={sectionNumber} imgName={imgName}/> : undefined}
        </div>
    );
};

InformationSection.propTypes = {
    sectionNumber: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    button: PropTypes.string.isRequired,
    imgName: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default InformationSection;