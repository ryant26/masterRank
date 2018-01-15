import React, {
  Component
} from 'react';

import { Redirect } from 'react-router'

import PlayerCard from '../../PlayerCard/PlayerCard';

export default class PlayerButton extends Component {

  constructor(props){
    super(props);
    this.state = {
        fireRedirect: false
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event){
    event.preventDefault();
    this.setState({
        fireRedirect: true
    });
  }

  render() {
    return (
        <div>
            { this.state.fireRedirect
                ? ( <Redirect to={{pathname: '/', state:{user: this.props.user}}}/> )
                : ( <button onClick={this.handleClick}>
                        <PlayerCard user={this.props.player} />
                    </button>)
            }
        </div>
    );
  }
};
