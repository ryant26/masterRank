import React from 'react';
import PropTypes from 'prop-types';

import * as AllHeroes from '../../resources/allHeroNames';
import SelectorButton from './HeroButton/HeroButton';

const HeroSelector = ({selectedHeroes, onHeroSelected}) => {
  return (
    <div className="HeroSelector flex wrap">
    {
      AllHeroes.names.map(name => {
        return (
          <SelectorButton
              heroName={name}
              key={name}
              selected={selectedHeroes.includes(name)}
              onClick={onHeroSelected}/>
        );
      })
    }
    </div>
  );
};

HeroSelector.propTypes = {
    selectedHeroes: PropTypes.array.isRequired,
    onHeroSelected: PropTypes.func.isRequired
};

export default HeroSelector;
