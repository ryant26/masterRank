import React, {
  Component
} from 'react';

import StatBox from '../StatBox/StatBox';
import PropTypes from 'prop-types';

export default class HeroCardStats extends Component {

  render() {
    let averageStats = this.props.hero.average_stats;

    const row = {
      'height': '56px',
      'padding': '15px',
    };

    return (
      <div>
        <div style={row}>
          <StatBox
            label="Eliminations"
            value={averageStats.eliminations_average}
            percentile="75%" />
          <StatBox
            label="K/D ratio"
            value={averageStats.deaths_average}
            percentile="45%" />
          <StatBox
            label="Accuracy"
            value={averageStats.deaths_average}
            percentile="50%" />
          <StatBox
            label="Blocked"
            value={averageStats.deaths_average}
            percentile="23%" />
          <StatBox
            label="Healing"
            value={averageStats.deaths_average}
            percentile="8%" />
          <StatBox
            label="Crits"
            value={averageStats.deaths_average}
            percentile="91%" />
        </div>

        <div style={row}>
          <StatBox
            label="Damage"
            value={averageStats.eliminations_average}
            percentile="65%" />
          <StatBox
            label="Obj. Kills"
            value={averageStats.deaths_average}
            percentile="65%" />
          <StatBox
            label="Obj. Time"
            value={averageStats.deaths_average}
            percentile="65%" />
          <StatBox
            label="specific 1"
            value={averageStats.deaths_average}
            percentile="65%" />
          <StatBox
            label="specific 2"
            value={averageStats.deaths_average}
            percentile="65%" />
          <StatBox
            label="specific 3"
            value={averageStats.deaths_average}
            percentile="65%" />
        </div>
      </div>
    );
  }
}

HeroCardStats.propTypes = {
  hero: PropTypes.shape({
    average_stats: PropTypes.object.isRequired
  })
};