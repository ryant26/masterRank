import React, {
  Component
} from 'react';

import HeroCardStats from '../HeroCardStats/HeroCardStats';
import HeroImage from '../HeroImage/HeroImage';
import InvitePlayerButton from '../InvitePlayerButton/InvitePlayerButton';
import PropTypes from 'prop-types';

export default class HeroCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isStatsToggleOn: false,
      isHovering: false,
    };

    this.toggleStats = this.toggleStats.bind(this);
    this.toggleInvitePlayerButton = this.toggleInvitePlayerButton.bind(this);
  }

  toggleStats() {
    this.setState(prevState => ({
      isStatsToggleOn: !prevState.isStatsToggleOn
    }));
  }

  toggleInvitePlayerButton() {
    this.setState(prevState => ({
      isHovering: !prevState.isHovering
    }));
  }

  render() {
    const containerStyle = {
      'display': 'flex',
      'backgroundColor': '#66ccff',
      'margin': '10px',
    };

    const statsStyle = {
      'display': 'flex',
    };

    const componentStyle = {
      'textAlign': 'center',
      'height': '60px',
      'width': '33%',
    };

    let wins = this.props.hero.wins;
    let losses = this.props.hero.losses;
    let winPercentage = parseFloat(wins/(wins+losses) * 100.0).toFixed(1);

    return (
      <div>
        <div style={containerStyle}
          onMouseEnter={this.toggleInvitePlayerButton}
          onMouseLeave={this.toggleInvitePlayerButton}>

          {
            this.state.isHovering
            ? <InvitePlayerButton />
            : <HeroImage heroName={this.props.hero.heroName}/>
          }

          <div>
            <div>{this.props.hero.platformDisplayName}</div>
          </div>

          <div style={statsStyle} onClick={this.toggleStats}>
            <div style={componentStyle} >
              <div>Rank</div>
              <div>2734</div>
            </div>

            <div style={componentStyle}>
              <div>Hours Played</div>
              <div>{this.props.hero.hoursPlayed}</div>
            </div>

            <div style={componentStyle}>
              <div>WIN %</div>
              <div>{winPercentage}%</div>
            </div>
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

HeroCard.propTypes = {
  hero: PropTypes.shape({
    heroName: PropTypes.string.isRequired
  })
};