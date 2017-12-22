import React from 'react';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';

let AddHeroIcon = (props) => {
  return (
    <div onClick={props.onClick} className="PreferredHeroes-AddHeroIcon flex justify-center align-center">
      <FontAwesome name="plus"/>
    </div>
  );
};

AddHeroIcon.propTypes = {
    onClick: PropTypes.func
};

export default AddHeroIcon;
