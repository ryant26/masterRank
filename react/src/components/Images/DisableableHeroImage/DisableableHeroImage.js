import React from 'react';
import PropTypes from 'prop-types';

import HeroImage from '../HeroImage/HeroImage';

const classNames = require('classnames');

const DisableableHeroImage = ({ heroName, disabled, onClick }) => {

    const classses = classNames({
        DisableableHeroImage,
        disabled: disabled
    });

    return (
        <div className={classses}>
            <HeroImage heroName={heroName} onClick={onClick} />
        </div>
    );
};

DisableableHeroImage.defaultProps = {
    disabled: false

};

DisableableHeroImage.propTypes = {
    disabled: PropTypes.bool,
    heroName: PropTypes.string.isRequired,
    onClick: PropTypes.func
};

export default DisableableHeroImage;