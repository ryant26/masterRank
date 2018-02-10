import React, {
    Component
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Model from '../../../model/model';
import HeroImage from '../../HeroImage/HeroImage';

const MemberCard = ({ member, number }) => {

    return (
        <div className="GroupHeroCard flex align-center">
            <div className="numberBox flex align-center sidebar-title numbers">{number}</div>
            <HeroImage className="HeroImage" heroName={member.heroName}/>
            <div className="imageStylePadding">
                <div className="flex justify-between">
                    {member.platformDisplayName}
                </div>
                <div className="inLine1">
                    <div>{member.heroName}</div>
                </div>
            </div>
        </div>
    );
};

MemberCard.propTypes = {
    member: PropTypes.shape({
        heroName: PropTypes.string.isRequired,
        platformDisplayName: PropTypes.string.isRequired,
        skillRating: PropTypes.number,
        stats: PropTypes.object,
    }).isRequired
};

export default MemberCard;