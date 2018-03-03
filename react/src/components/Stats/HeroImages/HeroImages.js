import React from 'react';
import HeroImage from '../../HeroImage/HeroImage';
import Proptypes from 'prop-types';

const HeroImages = ({heroNames, isPending}) => {
    return (
        <div className="HeroImages flex">
            {heroNames.map((name, i) => <HeroImage key={i} heroName={name} isPending={isPending}/>)}
        </div>
    );
};

HeroImages.defaultProps = {
    isPending: false
};

HeroImages.propTypes = {
    heroNames: Proptypes.array.isRequired,
    isPending: Proptypes.bool
};

export default HeroImages;