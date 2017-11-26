import React from 'react';
import HeroImage from '../../HeroImage/HeroImage';
import PropTypes from 'prop-types';

const GroupHeroCard = ({hero, number, name}) =>  {
    return (
        <div className="GroupHeroCard flex align-center">
            <div className="numberBox flex align-center sidebar-title numbers">{number}</div>
            <HeroImage className="HeroImage" heroName={hero.heroName}/>
            <div className="imageStylePadding">
                <div className="flex justify-between">
                {name}   
                </div>
                <div className="inLine1">
                    <div>{hero.heroName}</div>
                </div>
            </div>
        </div>
    );
};

GroupHeroCard.propTypes = {
    hero: PropTypes.object.isRequired,
    number: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
};

export default GroupHeroCard;