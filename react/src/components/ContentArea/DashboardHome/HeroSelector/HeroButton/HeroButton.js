import React from 'react';
import PropTypes from 'prop-types';
import HeroImage from '../../../../Images/HeroImage/HeroImage';
const classNames = require('classnames');

const SelectorButton = ({heroName, selected, disabled, onClick}) => {

  let classes = classNames({
      HeroButton: true,
      selected: selected,
      disabled: disabled
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
  disabled: PropTypes.bool,
  onClick: PropTypes.func
};

SelectorButton.defaultProps = {
    disabled: false
};

export default SelectorButton;