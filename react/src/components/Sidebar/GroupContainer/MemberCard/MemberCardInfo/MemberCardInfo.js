import React from 'react';
import PropTypes from 'prop-types';

const MemberCardInfo = ({ platformDisplayName, heroName, isPending, isLeader }) => {

    return (
        <div className="MemberCardInfo">
            <div className="display-name flex justify-between">
                { isPending
                    ? platformDisplayName + ' - Pending'
                    : isLeader
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
    isPending: PropTypes.bool,
    isLeader: PropTypes.bool,
};

export default MemberCardInfo;