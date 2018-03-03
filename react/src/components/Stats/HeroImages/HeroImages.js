import React from 'react';
import HeroImage from '../../HeroImage/HeroImage';
import Proptypes from 'prop-types';

const HeroImages = ({heroNames, disabled}) => {

    let heroImages = heroNames.map((name, i) => {
        return (
            <HeroImage
                key={i}
                heroName={name}
                disabled={disabled[i]}
            />
        );
    });

    return (
        <div className="HeroImages flex">
            { heroImages }
        </div>
    );
};

HeroImages.defaultProps = {
    disabled: []
};

HeroImages.propTypes = {
    heroNames: Proptypes.array.isRequired,
    disabled: Proptypes.arrayOf(Proptypes.bool)
};

export default HeroImages;