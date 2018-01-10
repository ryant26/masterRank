import React from 'react';
import PropTypes from 'prop-types';
import HeroImage from '../../../HeroImage/HeroImage';
const classNames = require('classnames');

const SelectorButton = ({heroName, selected, onClick}) => {

  let classes = classNames({
      HeroButton: true,
      selected: selected,
  });

  let clickHandler = () => {
      onClick(heroName);
  };

  return (
    <div className={classes} onClick={clickHandler}>
      <HeroImage heroName={heroName}/>
    </div>
  );
};

SelectorButton.propTypes = {
  heroName: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func
};

export default SelectorButton;