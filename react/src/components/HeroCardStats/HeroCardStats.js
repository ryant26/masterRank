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
            percentile="75%" />
          <StatBox
            label="K/D ratio"
            value={averageStats.kdRatio}
            percentile="45%" />
        </div>
        <div style={row}>
          <StatBox
            label="Accuracy"
            value={averageStats.accuracy}
            percentile="50%" />
          <StatBox
            label="Blocked"
            value={averageStats.blockedPerMin}
            percentile="23%" />
        </div>
        <div style={row}>
          <StatBox
            label="Healing"
            value={averageStats.healingPerMin}
            percentile="8%" />
          <StatBox
            label="Damage"
            value={averageStats.damagePerMin}
            percentile="65%" />
        </div>
        <div style={row}>
          <StatBox
            label="Obj. Kills"
            value={averageStats.avgObjElims}
            percentile="65%" />
          <StatBox
            label="Obj. Time"
            value={averageStats.avgObjTime}
            percentile="65%" />
        </div>
      </div>
    );
  }
}

HeroCardStats.propTypes = {
  hero: PropTypes.object.isRequired
};