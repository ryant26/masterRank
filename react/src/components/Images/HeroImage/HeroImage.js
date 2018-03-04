import React from 'react';
import PropTypes from 'prop-types';

const HeroImage = ({ heroName, onClick }) => {

    return (
        <img className="HeroImage"
            src={require(`../../../assets/${heroName}-icon.png`)}
            alt = {heroName+' icon'}
            onClick={onClick}
        />
    );
};

HeroImage.propTypes = {
    heroName: PropTypes.string.isRequired,
    onClick: PropTypes.func
};

export default HeroImage;