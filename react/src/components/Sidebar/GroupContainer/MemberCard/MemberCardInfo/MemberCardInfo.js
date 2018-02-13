import React from 'react';
import PropTypes from 'prop-types';

const MemberCardInfo = ({ platformDisplayName, heroName, pending, leader }) => {

    return (
        <div className="MemberCardInfo">
            <div className="display-name flex justify-between">
                { pending
                    ? platformDisplayName + ' - Pending'
                    : leader
                        ? platformDisplayName + ' - Leader'
                        : platformDisplayName
                }
            </div>
            <div className="hero-name">
                <div>{heroName}</div>
            </div>
        </div>
    );
};

MemberCardInfo.propTypes = {
    platformDisplayName: PropTypes.string.isRequired,
    heroName: PropTypes.string.isRequired,
    pending: PropTypes.bool,
    leader: PropTypes.bool,
};

export default MemberCardInfo;