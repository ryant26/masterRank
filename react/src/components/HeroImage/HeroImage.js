import React from 'react';
import PropTypes from 'prop-types';

const classNames = require('classnames');

const HeroImage = ({ heroName, isPending, onClick }) => {

    const classses = classNames({
        HeroImage,
        pending: isPending
    });

    return (
        <img className={classses}
            src={require(`../../assets/${heroName}-icon.png`)}
            alt = {heroName+' icon'}
            onClick={onClick}
        />
    );
}

HeroImage.defaultProps = {
    isPending: false
};

HeroImage.propTypes = {
    heroName: PropTypes.string.isRequired,
    isPending: PropTypes.bool,
    onClick: PropTypes.func
};

export default HeroImage;