import React from 'react';
import PropTypes from 'prop-types';

const MemberCardInfo = ({ platformDisplayName, heroName, pending, leader }) => {

    return (
        <div className="imageStylePadding">
            <div className="flex justify-between">
                { pending
                    ? platformDisplayName + ' - Pending'
                    : leader
                        ? platformDisplayName + ' - Leader'
                        : platformDisplayName
                }
            </div>
            <div className="inLine1">
                <div>{heroName}</div>
            </div>
        </div>
    );
};

MemberCardInfo.propTypes = {
    platformDisplayName: PropTypes.string.isRequired,
    heroName: PropTypes.string.isRequired,
};

export default MemberCardInfo;