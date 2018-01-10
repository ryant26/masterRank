import React, {
  Component
} from 'react';


export default class LoginPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
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

    return (
      <div> Login </div>
    );
  }
}