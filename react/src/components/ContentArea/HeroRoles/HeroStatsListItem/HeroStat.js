import React from 'react';
import PropTypes from 'prop-types';

const HeroStat = ({stat, percentile, statLabel, statName}) => {
    const indicatorLevel = {
        'width': (percentile * 100) + '%',
    };

    let statNode;

    if (stat) {
        stat = stat.toFixed(0);
        statNode = <div><span className="stat">{stat}</span><span className="stat-label sub-title">{statLabel}</span></div>;
    } else {
        statNode = <span className="stat">-</span>;
    }

    return (
        <div className="HeroStat flex flex-column">
            {statNode}
            <div className="indicator">
                <div className="indicator-level" style={indicatorLevel}/>
            </div>
            <div className="sub-title">{statName.toUpperCase()}</div>
        </div>
    );
};

HeroStat.propTypes = {
    stat: PropTypes.number,
    percentile: PropTypes.number.isRequired,
    statLabel: PropTypes.string.isRequired,
    statName: PropTypes.string.isRequired
};

export default HeroStat;