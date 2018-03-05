import React from 'react';
import Proptypes from 'prop-types';

import DisableableHeroImage from '../../Images/DisableableHeroImage/DisableableHeroImage';
import HeroImage from '../../Images/HeroImage/HeroImage';

const HeroImages = ({heroNames, disabled}) => {

    let heroImages = heroNames.map((name, i) => {
        return ( disabled[i]
            ? ( <DisableableHeroImage
                    key={i}
                    heroName={name}
                    disabled={true}
                />)
            : ( <HeroImage
                 key={i}
                 heroName={name}
                />)
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