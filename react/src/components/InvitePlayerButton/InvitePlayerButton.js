import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';

import FontAwesome from 'react-fontawesome';

export default class InvitePlayerButton extends Component {

  constructor(props) {
    super(props);
    
    this.invitePlayer = this.invitePlayer.bind(this);
  }

  invitePlayer() {
    // TODO: commented to pass linting
    // const hero = this.props.hero; 
    // const socketData = {
    //   "battleNetId": hero.platformDisplayName,
    //   "heroName": hero.heroName
    // };
    
    // TODO: implement sendInvite(socketData) via socket server
  }

  render() {
    const buttonStyle = {
      'backgroundColor': 'lightgrey',
      'color': 'darkgrey',
      'height': '60px',
      'width': '60px',
      'float': 'left',
      'fontSize': '48px',
      'cursor': 'pointer'
    };

    return (
      <button style={buttonStyle} onClick={this.invitePlayer}>
        <FontAwesome name="plus" />
      </button>
    );
  }
}

InvitePlayerButton.propTypes = {
  hero: PropTypes.shape({
    heroName: PropTypes.string.isRequired,
    wins: PropTypes.number.isRequired,
    losses: PropTypes.number.isRequired,
    platformDisplayName: PropTypes.string.isRequired,
    hoursPlayed: PropTypes.number.isRequired,
  })
};
