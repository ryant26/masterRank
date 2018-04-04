import React from 'react';

const ScrollButton = () => {
    const scrollToFirstInfoSection = () => {
        document.getElementsByClassName('InformationSection')[0].scrollIntoView({block: 'start', behavior: 'smooth'});
    };

    return (
        <div className="ScrollButton flex flex-column align-center">
            <h3> HOW IT WORKS </h3>
            <img src={require('assets/scroll-icon.png')} onClick={scrollToFirstInfoSection}/>
        </div>
    );
};

export default ScrollButton;