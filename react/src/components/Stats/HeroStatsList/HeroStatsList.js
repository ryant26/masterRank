import React from 'react';
import PropTypes from 'prop-types';
import HeroStatsListItem from "../HeroStatsListItem/HeroStatsListItem";

const HeroStatsList =  ({heroes, emptyMessage, showPlatformDisplayName, groupLeader}) => {

    let heroStatsCards = heroes.filter((hero) => hero.stats).map((hero, i) =>
        (
            <HeroStatsListItem
                key={i}
                hero={hero}
                isLeader={groupLeader === hero.platformDisplayName}
                showPlatformDisplayName={showPlatformDisplayName}
            />
        ));

    if (!heroStatsCards.length) {
        heroStatsCards = <div className="flex justify-center sub-title">{emptyMessage}</div>;
    }

    return (
      <div className="HeroStatsList">
        {heroStatsCards}
      </div>
    );
};

HeroStatsList.propTypes = {
    heroes: PropTypes.array.isRequired,
    emptyMessage: PropTypes.string,
    showPlatformDisplayName: PropTypes.bool,
    groupLeader: PropTypes.string
};

HeroStatsList.defaultProps = {
    emptyMessage: 'We have no stats on this player.',
    showPlatformDisplayName: false,
    groupLeader: ''
};

export default HeroStatsList;