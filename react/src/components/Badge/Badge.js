import React from 'react';
import PropTypes from 'prop-types';

const Badge = ({number}) => {
  return (
    <div className="Badge">
      <div className="background flex justify-center align-center">
        <div className="label">
          {number}
        </div>
      </div>
    </div>
  );
};

Badge.propTypes = {
  number: PropTypes.number.isRequired
};

export default Badge;