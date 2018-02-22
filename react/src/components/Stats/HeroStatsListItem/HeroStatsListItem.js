import React from 'react';
import HeroImage from "../../HeroImage/HeroImage";
import PropTypes from 'prop-types';
import RecordStat from './RecordStat';
import HeroStat from './HeroStat';

const HeroStatsListItem = ({hero, showPlatformDisplayName, isLeader}) => {
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

    const leaderIcon = isLeader ?
        (<img className="crown"
            src={require(`../../../assets/leader-icon.svg`)}
            alt = "leader-icon"
        />) : undefined;

    let subTitle = hero.stats
        ? ( <div className="sub-title">{hero.stats.hoursPlayed} hours played</div> )
        : ( <div className="sub-title">Hero needs more games played</div> );

    let heroWins            = hero.stats ? hero.stats.wins || 0 : "N/A";
    let heroLosses          = hero.stats ? hero.stats.losses || 0 : "N/A";
    let heroKdRatio         = hero.stats
        ? (hero.stats.kdRatio ? hero.stats.kdRatio : 0).toFixed(2)
        : "N/A";
    let heroDamagePerMin    = hero.stats ? hero.stats.damagePerMin || 0 : undefined;
    let heroPDamagePerMin  = hero.stats && hero.stats.pDamagePerMin || 0;

    let heroHealingPerMin   = hero.stats ? hero.stats.healingPerMin || 0 : undefined;
    let heroPHealingPerMin   = hero.stats && hero.stats.pHealingPerMin || 0;

    let heroBlockedPerMin   = hero.stats ? hero.stats.blockedPerMin || 0 : undefined;
    let heroPBlockedPerMin   = hero.stats && hero.stats.pBlockedPerMin || 0;

    let heroAvgObjElims     = hero.stats ? hero.stats.avgObjElims || 0 : undefined;
    let heroPAvgObjElims     = hero.stats && hero.stats.pAvgObjElims || 0

    let heroAvgObjTime      = hero.stats ? hero.stats.avgObjTime || 0 : undefined;
    let heroPAvgObjTime      = hero.stats && hero.stats.pAvgObjTime || 0;

    let heroAccuracy        = hero.stats ? hero.stats.accuracy || 0 : undefined;
    let heroPAccuracy        = hero.stats && hero.stats.pAccuracy || 0;

    return (
        <div className="HeroStatsListItem">
             <div className="flex align-center">
                 <div>
                     {leaderIcon}
                     <HeroImage heroName={hero.heroName}/>
                 </div>
                 <div>
                     <h3>{showPlatformDisplayName ? `${hero.platformDisplayName} - ` : ''}{hero.heroName[0].toUpperCase() + hero.heroName.slice(1)}</h3>
                     { subTitle }
                 </div>
                 <div className="flex justify-between record">
                     <RecordStat stat={heroWins} statName={statNames.wins}/>
                     <RecordStat stat={heroLosses} statName={statNames.losses}/>
                     <RecordStat stat={heroKdRatio} statName={statNames.kdRatio}/>
                 </div>
             </div>
             <div className="flex wrap justify-between">
                 <HeroStat stat={heroDamagePerMin}
                       percentile={heroPDamagePerMin} statLabel={statLabels.perMinute} statName={statNames.damage}/>
                 <HeroStat stat={heroHealingPerMin}
                       percentile={heroPHealingPerMin} statLabel={statLabels.perMinute} statName={statNames.healing}/>
                 <HeroStat stat={heroBlockedPerMin}
                       percentile={heroPBlockedPerMin} statLabel={statLabels.perMinute} statName={statNames.blocked}/>
                 <HeroStat stat={heroAvgObjElims}
                       percentile={heroPAvgObjElims} statLabel={statLabels.perMinute} statName={statNames.objKills}/>
                 <HeroStat stat={heroAvgObjTime}
                           percentile={heroPAvgObjTime} statLabel={statLabels.perMinute} statName={statNames.objTime}/>
                 <HeroStat stat={heroAccuracy}
                       percentile={heroPAccuracy} statLabel={statLabels.percent} statName={statNames.accuracy}/>
             </div>
         </div>
    );
};

HeroStatsListItem.propTypes = {
    hero: PropTypes.shape({
        heroName: PropTypes.string.isRequired,
        stats: PropTypes.object
    }).isRequired,
    showPlatformDisplayName: PropTypes.bool,
    isLeader: PropTypes.bool
};

export default HeroStatsListItem;