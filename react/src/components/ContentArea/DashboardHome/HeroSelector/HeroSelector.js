import React from 'react';
import PropTypes from 'prop-types';

import SelectorButton from 'components/ContentArea/DashboardHome/HeroSelector/HeroButton/HeroButton';
const AllHeroes = require('shared/libs/allHeroNames');

const HeroSelector = ({selectedHeroes, onHeroSelected, disabledHeroes}) => {
  return (
    <div className="HeroSelector flex wrap">
    {
      AllHeroes.names.map(name => {
        return (
          <SelectorButton
              heroName={name}
              key={name}
              selected={selectedHeroes.includes(name)}
              disabled={disabledHeroes.includes(name)}
              onClick={onHeroSelected}/>
        );
      })
    }
    </div>
  );
};

HeroSelector.propTypes = {
    selectedHeroes: PropTypes.array.isRequired,
    onHeroSelected: PropTypes.func.isRequired,
    disabledHeroes: PropTypes.array
};

HeroSelector.defaultProps = {
    disabledHeroes: []
};

export default HeroSelector;
