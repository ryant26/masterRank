import React, {
  Component
} from 'react';

import HeroCardStats from './HeroCardStats.js'

export default class HeroCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isStatsToggleOn: false,
    };

    this.toggleStats = this.toggleStats.bind(this);
  }

  toggleStats() {
    this.setState(prevState => ({
      isStatsToggleOn: !prevState.isStatsToggleOn
    }))
  }

  render() {
    const containerStyle = {
      'backgroundColor': '#fff',
      'width': '720px',
      'padding': '5px',
      // 'border': '5px solid red',
    }

    const heroIconStyle = {
      'float': 'left',
      'textAlign': 'center',
      'height': '60px',
      'width': '25%',
    }

    const SRStyle = {
      'float': 'left',
      'textAlign': 'center',
      'height': '60px',
      'width': '25%',
    }

    const gamesPlayedStyle = {
      'float': 'left',
      'textAlign': 'center',
      'height': '60px',
      'width': '25%',
    }

    const winPercentageStyle = {
      'float': 'left',
      'textAlign': 'center',
      'height': '60px',
      'width': '25%',
    }

    let winPercentage = parseFloat(this.props.hero.general_stats.win_percentage * 100.0).toFixed(1);

    return (
      <div style={containerStyle} onClick={this.toggleStats}>
        <div style={heroIconStyle}>{this.props.hero.name}</div>


        <div style={SRStyle}>
          <div>SR</div>
          <div>2734</div>
        </div>

        <div style={gamesPlayedStyle}>{this.props.hero.general_stats.games_played}</div>

        <div style={winPercentageStyle}>
          <div>WIN %</div>
          <div>{winPercentage}%</div>
        </div>

        {
          this.state.isStatsToggleOn
          ? <HeroCardStats hero={this.props.hero}/>
          : null
        }
      </div>
    );
  }
}
