import React from 'react';
import HeroImage from '../../HeroImage/HeroImage';
import Proptypes from 'prop-types';

const HeroImages = ({heroNames}) => {
    return (
        <div className="HeroImages flex">
            {heroNames.map((name, i) => <HeroImage key={i} heroName={name}/>)}
        </div>
    );
};

HeroImages.propTypes = {
    heroNames: Proptypes.array.isRequired
};

export default HeroImages;