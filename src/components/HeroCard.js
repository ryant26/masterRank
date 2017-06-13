import React, {
  Component
} from 'react';
import FontAwesome from 'react-fontawesome'

import HeroCardStats from './HeroCardStats.js'

export default class HeroCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isStatsToggleOn: false,
      isHovering: false,
    };

    this.toggleStats = this.toggleStats.bind(this);
    this.toggleHover = this.toggleHover.bind(this);
  }

  toggleStats() {
    this.setState(prevState => ({
      isStatsToggleOn: !prevState.isStatsToggleOn
    }))
  }

  toggleHover() {
    this.setState(prevState => ({
      isHovering: !prevState.isHovering
    }))
  }

  render() {
    const containerStyle = {
      'display': 'flex',
      'backgroundColor': '#66ccff',
      'width': '720px',
      'margin': '10px',
    }

    const heroIconStyle = {
      'backgroundColor': 'lightgrey',
      'color': 'darkgrey',
      'height': '60px',
      'width': '60px',
      'float': 'left',
      'fontSize': '48px',
    }

    const boxStyle = {
      'textAlign': 'center',
      'height': '60px',
      'width': '25%',
    }

    let winPercentage = parseFloat(this.props.hero.general_stats.win_percentage * 100.0).toFixed(1);

    return (
      <div>
        <div style={containerStyle}
          onClick={this.toggleStats}
          onMouseEnter={this.toggleHover}
          onMouseLeave={this.toggleHover}>

          <div style={boxStyle}>
            {
              this.state.isHovering
              ? <button style={heroIconStyle}>
                  <FontAwesome name='plus' />
                </button>
              : <img style={heroIconStyle}
                  src={require(`../assets/${this.props.hero.name}-icon.png`)}
                  alt = {this.props.hero.name+' icon'}
                />
            }
          </div>

          <div style={boxStyle}>
            <div>Rank</div>
            <div>2734</div>
          </div>

          <div style={boxStyle}>
            <div>Games Played</div>
            <div>{this.props.hero.general_stats.games_played}</div>
          </div>

          <div style={boxStyle}>
            <div>WIN %</div>
            <div>{winPercentage}%</div>
          </div>
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
