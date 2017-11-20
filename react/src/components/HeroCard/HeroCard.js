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
    const backgroundStyle = {
      'backgroundColor': '#66ccff'      
    };

    const containerStyle = {
      'display': 'flex',
    };

    const statsStyle = {
      'display': 'flex',
      'flexDirection':'column',
      'width':'240px',
      'cursor':'s-resize'      
    };

    const componentStyle = {
      'height':'20px'
    };
    
    let wins = this.props.hero.wins;
    let losses = this.props.hero.losses;
    let winPercentage = parseFloat(wins/(wins+losses) * 100.0).toFixed(1);

    return (
      <div>
        <div style={backgroundStyle}>
          <div onMouseEnter={this.toggleInvitePlayerButton}
               onMouseLeave={this.toggleInvitePlayerButton}>
                {
                    this.state.isHovering? <InvitePlayerButton /> : 
                                           <HeroImage heroName={this.props.hero.heroName}/>
                }
          </div>
          <div style={containerStyle}>
            <div style={statsStyle} onClick={this.toggleStats}>
              <div>
                <div><b>{this.props.hero.platformDisplayName}</b></div>
              </div>
              <div style={componentStyle} >
                <div><b>Rank:</b> 2733</div>
              </div>

              <div style={componentStyle}>
                <div><b>Hours Played:</b> {this.props.hero.hoursPlayed}</div>
              </div>

              <div style={componentStyle}>
                <div><b>Win Rate:</b> {winPercentage}%</div>
              </div>
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
    heroName: PropTypes.string.isRequired,
    wins: PropTypes.number.isRequired,
    losses: PropTypes.number.isRequired,
    platformDisplayName: PropTypes.string.isRequired,
    hoursPlayed: PropTypes.number.isRequired,
  })
};