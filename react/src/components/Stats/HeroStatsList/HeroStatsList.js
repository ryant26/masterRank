import React from 'react';
import PropTypes from 'prop-types';
import HeroStatsListItem from "components/Stats/HeroStatsListItem/HeroStatsListItem";

const HeroStatsList =  ({heroes, showPlatformDisplayName, groupLeader, isPending}) => {

    let heroStatsCards = heroes.map((hero, i) =>
        (
            <HeroStatsListItem
                key={i}
                hero={hero}
                isLeader={groupLeader === hero.platformDisplayName}
                showPlatformDisplayName={showPlatformDisplayName}
                isPending={isPending}
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
    groupLeader: PropTypes.string,
    isPending: PropTypes.bool
};

HeroStatsList.defaultProps = {
    showPlatformDisplayName: false,
    groupLeader: '',
    isPending: false
};

export default HeroStatsList;