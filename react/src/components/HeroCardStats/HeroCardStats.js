import React, {
  Component
} from 'react';

import StatBox from '../StatBox/StatBox';
import PropTypes from 'prop-types';

export default class HeroCardStats extends Component {

  render() {
    let averageStats = this.props.hero;

    const row = {
      'height': '56px'
    };

    return (
      <div>
        <div style={row}>
          <StatBox
            label="Eliminations"
            value={averageStats.avgObjElims}
            percentile={`${averageStats.pAvgObjElims * 100}%`} />
          <StatBox
            label="K/D ratio"
            value={averageStats.kdRatio}
            percentile={`${averageStats.pKdRatio * 100}%`} />
        </div>
        <div style={row}>
          <StatBox
            label="Accuracy"
            value={averageStats.accuracy}
            percentile={`${averageStats.pAccuracy * 100}%`} />
          <StatBox
            label="Blocked / Min"
            value={averageStats.blockedPerMin}
            percentile={`${averageStats.pBlockedPerMin * 100}%`} />
        </div>
        <div style={row}>
          <StatBox
            label="Healing / Min"
            value={averageStats.healingPerMin}
            percentile={`${averageStats.pHealingPerMin * 100}%`} />
          <StatBox
            label="Damage / Min"
            value={averageStats.damagePerMin}
            percentile={`${averageStats.pDamagePerMin * 100}%`} />
        </div>
        <div style={row}>
          <StatBox
            label="Obj. Kills"
            value={averageStats.avgObjElims}
            percentile={`${averageStats.pAvgObjElims * 100}%`} />
          <StatBox
            label="Obj. Time"
            value={averageStats.avgObjTime}
            percentile={`${averageStats.pAvgObjTime * 100}%`} />
        </div>
      </div>
    );
  }
}

HeroCardStats.propTypes = {
  hero: PropTypes.object.isRequired
};