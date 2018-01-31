import React from 'react';
import PropTypes from 'prop-types';
import HeroStatsCard from "../HeroStatsListItem/HeroStatsListItem";

const HeroStatsList =  ({heroes}) => {

    let heroStatsCards = heroes.filter((hero) => hero.stats).map((hero, i) => <HeroStatsCard key={i} hero={hero}/>);

    if (!heroStatsCards.length) {
        heroStatsCards = <div className="flex justify-center sub-title">We have no stats on this player.</div>;
    }

    return (
      <div className="HeroStatsList">
        {heroStatsCards}
      </div>
    );
};

HeroStatsList.propTypes = {
    heroes: PropTypes.array.isRequired,
};

export default HeroStatsList;