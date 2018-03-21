import React from 'react';
import { connect } from 'react-redux';

import DisableableHeroImage from "components/Images/DisableableHeroImage/DisableableHeroImage";
import PropTypes from 'prop-types';
import RecordStat from 'components/Stats/HeroStatsListItem/RecordStat';
import HeroStat from 'components/Stats/HeroStatsListItem/HeroStat';

const HeroStatsListItem = ({user, hero, showPlatformDisplayName, isLeader, isPending}) => {
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
            src={require(`assets/leader-icon.svg`)}
            alt = "leader-icon"
        />) : undefined;

    const displayName = showPlatformDisplayName
        ? (user.platformDisplayName === hero.platformDisplayName)
            ? "You - "
            : `${hero.platformDisplayName} - `
        : '';

    const subTitle = isPending
        ? ( "Pending invite" )
        : hero.stats
            ? ( `${hero.stats.hoursPlayed} hours played` )
            : ( "Hero needs more games played" );

    let heroWins            = hero.stats ? hero.stats.wins || 0 : "N/A";
    let heroLosses          = hero.stats ? hero.stats.losses || 0 : "N/A";
    let heroKdRatio         = hero.stats
        ? (hero.stats.kdRatio ? hero.stats.kdRatio : 0).toFixed(2)
        : "N/A";
    let heroDamagePerMin    = hero.stats ? hero.stats.damagePerMin || 0 : undefined;
    let heroPDamagePerMin   = hero.stats && hero.stats.pDamagePerMin || 0;
    let heroHealingPerMin   = hero.stats ? hero.stats.healingPerMin || 0 : undefined;
    let heroPHealingPerMin  = hero.stats && hero.stats.pHealingPerMin || 0;
    let heroBlockedPerMin   = hero.stats ? hero.stats.blockedPerMin || 0 : undefined;
    let heroPBlockedPerMin  = hero.stats && hero.stats.pBlockedPerMin || 0;
    let heroAvgObjElims     = hero.stats ? hero.stats.avgObjElims || 0 : undefined;
    let heroPAvgObjElims    = hero.stats && hero.stats.pAvgObjElims || 0;
    let heroAvgObjTime      = hero.stats ? hero.stats.avgObjTime || 0 : undefined;
    let heroPAvgObjTime     = hero.stats && hero.stats.pAvgObjTime || 0;
    let heroAccuracy        = hero.stats ? hero.stats.accuracy || 0 : undefined;
    let heroPAccuracy       = hero.stats && hero.stats.pAccuracy || 0;

    return (
        <div className="HeroStatsListItem">
             <div className="flex align-center">
                 <div>
                     {leaderIcon}
                     <DisableableHeroImage heroName={hero.heroName} disabled={isPending}/>
                 </div>
                 <div>
                     <h3>{displayName}{hero.heroName[0].toUpperCase() + hero.heroName.slice(1)}</h3>
                     <div className="sub-title">{ subTitle }</div>
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
    user: PropTypes.shape({
        platformDisplayName: PropTypes.string.isRequired
    }).isRequired,
    hero: PropTypes.shape({
        heroName: PropTypes.string.isRequired,
        stats: PropTypes.object
    }).isRequired,
    showPlatformDisplayName: PropTypes.bool,
    isLeader: PropTypes.bool,
    isPending: PropTypes.bool
};

const mapStateToProps = (state) => {
    return {
      user: state.user
    };
};

export default connect(mapStateToProps)(HeroStatsListItem);