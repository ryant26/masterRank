import React from 'react';
import HeroImage from "../../HeroImage/HeroImage";
import PropTypes from 'prop-types';
import RecordStat from './RecordStat';
import HeroStat from './HeroStat';

const HeroStatsListItem = ({hero}) => {
    const statLabels = {
        perMinute: '/min',
        seconds: 'seconds',
        percent: '%'
    };

    const statNames = {
        damage: 'damage',
        healing: 'healing',
        blocked: 'blocked',
        objKills : 'obj. kills',
        objTime: 'obj. time',
        accuracy: 'accuracy',
        wins: 'wins',
        losses: 'losses',
        kdRatio: 'k/d'
    };

    return (
        <div className="HeroStatsListItem">
            <div className="flex align-center">
                <HeroImage heroName={hero.heroName}/>
                <div>
                    <h3>{hero.heroName[0].toUpperCase() + hero.heroName.slice(1)}</h3>
                    <div className="sub-title">{hero.stats.hoursPlayed} hours played</div>
                </div>
                <div className="flex justify-between record">
                    <RecordStat stat={hero.stats.wins || 0} statName={statNames.wins}/>
                    <RecordStat stat={hero.stats.losses || 0} statName={statNames.losses}/>
                    <RecordStat stat={(hero.stats.kdRatio ? hero.stats.kdRatio : 0).toFixed(2)} statName={statNames.kdRatio}/>
                </div>
            </div>
            <div className="flex wrap justify-between">
                <HeroStat stat={hero.stats.damagePerMin || 0}
                          percentile={hero.stats.pDamagePerMin} statLabel={statLabels.perMinute} statName={statNames.damage}/>
                <HeroStat stat={hero.stats.healingPerMin || 0}
                          percentile={hero.stats.pHealingPerMin} statLabel={statLabels.perMinute} statName={statNames.healing}/>
                <HeroStat stat={hero.stats.blockedPerMin || 0}
                          percentile={hero.stats.pBlockedPerMin} statLabel={statLabels.perMinute} statName={statNames.blocked}/>
                <HeroStat stat={hero.stats.avgObjElims || 0}
                          percentile={hero.stats.pAvgObjElims} statLabel={statLabels.perMinute} statName={statNames.objKills}/>
                <HeroStat stat={hero.stats.avgObjTime || 0}
                          percentile={hero.stats.pAvgObjTime} statLabel={statLabels.perMinute} statName={statNames.objTime}/>
                <HeroStat stat={hero.stats.accuracy || 0}
                          percentile={hero.stats.pAccuracy} statLabel={statLabels.percent} statName={statNames.accuracy}/>
            </div>
        </div>
    );
};

HeroStatsListItem.propTypes = {
    hero: PropTypes.shape({
        heroName: PropTypes.string.isRequired,
        stats: PropTypes.object.isRequired
    }).isRequired
};

export default HeroStatsListItem;