import React from 'react';
import PropTypes from 'prop-types';

const classNames = require('classnames');

const HeroImage = ({ heroName, disabled, onClick }) => {

    const classses = classNames({
        disabled: disabled
    });

    return (
        <div className={classses}>
            <img className="HeroImage"
                src={require(`../../assets/${heroName}-icon.png`)}
                alt = {heroName+' icon'}
                onClick={onClick}
            />
        </div>
    );
};

HeroImage.defaultProps = {
    disabled: false
};

HeroImage.propTypes = {
    heroName: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func
};

export default HeroImage;