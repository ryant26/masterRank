import React, {
  Component
} from 'react'

import FontAwesome from 'react-fontawesome'

export default class InvitePlayerButton extends Component {

  constructor(props) {
    super(props);
    
    this.invitePlayer = this.invitePlayer.bind(this);
  }

  invitePlayer() {
    console.log("invite player");
  }

  render() {
    const buttonStyle = {
      'backgroundColor': 'lightgrey',
      'color': 'darkgrey',
      'height': '60px',
      'width': '60px',
      'float': 'left',
      'fontSize': '48px',
    }

    return (
      <button style={buttonStyle} onClick={this.invitePlayer}>
        <FontAwesome name='plus' />
      </button>
    );
  }
}
