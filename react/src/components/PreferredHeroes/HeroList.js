import React from 'react';
import HeroImage from '../HeroImage/HeroImage';
import AddHeroIcon from './AddHeroIcon';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';

const HeroList = ({ heroes }) => {
  let heroThumbnails = heroes.map((hero) => {
    return (
      <HeroImage key={hero.heroName} heroName={hero.heroName}/>
    );
  });

  let remainingSlots = 5 - heroThumbnails.length;

  for (let i = 0; i < remainingSlots; i++) {
    heroThumbnails.push(<AddHeroIcon key={i}/>);
  }

  return (
    <div className="PreferredHeroes-HeroList flex flex-column">
      <div className="flex justify-between">
        <div className="sidebar-title">Preferred Heroes</div>
        <FontAwesome name="cog"/>
      </div>
      <div className="flex justify-between">
        {heroThumbnails}
      </div>
    </div>
  );
};

HeroList.propTypes = {
  heroes: PropTypes.array.isRequired
};

export default HeroList;