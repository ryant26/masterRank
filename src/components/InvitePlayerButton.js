import React, {
  Component
} from 'react'

import FontAwesome from 'react-fontawesome'

export default class InvitePlayerButton extends Component {

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
      <button style={buttonStyle}>
        <FontAwesome name='plus' />
      </button>
    );
  }
}
