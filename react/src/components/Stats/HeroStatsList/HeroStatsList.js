import React from 'react';
import PropTypes from 'prop-types';
import HeroStatsListItem from "../HeroStatsListItem/HeroStatsListItem";

const HeroStatsList =  ({heroes, showPlatformDisplayName, groupLeader}) => {

    let heroStatsCards = heroes.map((hero, i) =>
        (
            <HeroStatsListItem
                key={i}
                hero={hero}
                isLeader={groupLeader === hero.platformDisplayName}
                showPlatformDisplayName={showPlatformDisplayName}
            />
        ));

    return (
      <div className="HeroStatsList">
        {heroStatsCards}
      </div>
    );
};

HeroStatsList.propTypes = {
    heroes: PropTypes.array.isRequired,
    showPlatformDisplayName: PropTypes.bool,
    groupLeader: PropTypes.string
};

HeroStatsList.defaultProps = {
    showPlatformDisplayName: false,
    groupLeader: ''
};

export default HeroStatsList;