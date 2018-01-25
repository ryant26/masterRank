import React from 'react';
import HeroImage from '../../../HeroImage/HeroImage';
import PropTypes from 'prop-types';

const GroupHeroCard = ({hero, number, userName, pending, leader}) =>  {

    if (pending) {
        userName = userName + ' - Pending';
    }

    if (leader) {
        userName = userName + ' - Leader';
    }

    return (
        <div className="GroupHeroCard flex align-center">
            <div className="numberBox flex align-center sidebar-title numbers">{number}</div>
            <HeroImage className="HeroImage" heroName={hero.heroName}/>
            <div className="imageStylePadding">
                <div className="flex justify-between">
                    {userName}   
                </div>
                <div className="inLine1">
                    <div>{hero.heroName}</div>
                </div>
            </div>
        </div>
    );
};

GroupHeroCard.propTypes = {
    hero: PropTypes.shape({
        heroName: PropTypes.string.isRequired
    }).isRequired,
    number: PropTypes.number.isRequired,
    userName: PropTypes.string.isRequired,
    pending: PropTypes.bool,
    leader: PropTypes.bool
};

export default GroupHeroCard;