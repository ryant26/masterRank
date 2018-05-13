import React from 'react';
import PropTypes from 'prop-types';

const SectionImage = ({number, imgName}) => {
    return <img alt={imgName} className={`info-${number}`} src={require(`assets/${imgName}.png`)}/>;
};

SectionImage.propTypes = {
    imgName: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
};

export default SectionImage;