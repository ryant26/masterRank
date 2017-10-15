import React, {
  Component
} from 'react';

export default class StatBox extends Component {

  render() {

    const container = {
      'float': 'left',
      'backgroundColor': 'white',
      'height': '46px',
      'width': '120px',
      'textAlign': 'left',
    }

    const indicator = {
      'backgroundColor': 'lightgrey',
      'height': '5px',
      'width': '90px',
    }

    const indicatorLevel = {
      'backgroundColor': 'blue',
      'height': '5px',
      'width': this.props.percentile,
    }

    return (
      <div style={container}>
        <div>{this.props.value} / min </div>
        <div style={indicator}>
          <div style={indicatorLevel}/>
        </div>
        <div>{this.props.label}</div>
      </div>
    )
  }
}
