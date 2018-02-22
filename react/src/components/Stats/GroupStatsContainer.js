import React from 'react';
import PropTypes from 'prop-types';

import HeroStatsList from './HeroStatsList/HeroStatsList';
import HeroImages from './HeroImages/HeroImages';
import Model from '../../model/model';

const GroupStatsContainer = ({group, isLeading, toggleModal}) => {
    const groupHeroes = [group.leader, ...group.members];

    const wins = groupHeroes.reduce((wins, hero) => {
        if (hero.stats && hero.stats.wins) {
            return wins + hero.stats.wins;
        }
        return wins;
    }, 0);

    const totalGames = groupHeroes.reduce((games, hero) => {
        if (hero.stats && hero.stats.gamesPlayed) {
            return games + hero.stats.gamesPlayed;
        }

        return games;
    }, 0);

    const groupWinRate = (totalGames ? wins / totalGames : 0) * 100;
    const groupSr = Math.floor(groupHeroes.reduce((sr, hero) => sr + hero.skillRating, 0) / groupHeroes.length);

    const leaveGroup = () => {
        toggleModal();
        let preferredHeroName = group.leader.heroName;
        Model.leaveGroup();
        Model.createNewGroup(preferredHeroName);
    };

    return (
        <div className="GroupStatsContainer">
            <div className="header">
                <div className="flex justify-between align-center">
                    <div>
                        <div className="title flex align-center">
                            <h3>{isLeading ? 'Your ' : `${group.leader.platformDisplayName}'s`}</h3>
                            <h3 className="regular">Group</h3>
                        </div>
                        <span className="sub-title"><b>{groupSr}</b> Group SR</span>
                        {groupWinRate ? <span className="sub-title"><b>{groupWinRate.toFixed(1)}% </b> Group Winrate</span> : ''}
                    </div>
                    <HeroImages heroNames={groupHeroes.map((hero) => hero.heroName)}/>
                </div>
            </div>
            <div className="body">
                <HeroStatsList
                    heroes={groupHeroes}
                    emptyMessage="We have no stats on this group."
                    showPlatformDisplayName={true}
                    groupLeader={group.leader.platformDisplayName}
                />
            </div>
            {!isLeading ?
                <div className="footer flex justify-between align-center">
                    <div className="sub-title">
                        <b>Players joined: {groupHeroes.length}</b>
                    </div>
                    <div className="button-six flex align-center" onClick={leaveGroup}>
                        <div className="button-content">
                            LEAVE GROUP
                        </div>
                    </div>
                </div> :
                undefined
            }
        </div>
    );
};

GroupStatsContainer.propTypes = {
    group: PropTypes.object.isRequired,
    isLeading: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func
};


export default GroupStatsContainer;