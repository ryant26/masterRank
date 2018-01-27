import React from 'react';
import PropTypes from 'prop-types';

const RecordStat = ({stat, statName}) => {
    return (
        <div className="RecordStat flex flex-column align-end">
            <div className="stat">{stat}</div>
            <div className="sub-title">{statName.toUpperCase()}</div>
        </div>
    );
};

RecordStat.propTypes = {
    stat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    statName: PropTypes.string.isRequired
};


export default RecordStat;