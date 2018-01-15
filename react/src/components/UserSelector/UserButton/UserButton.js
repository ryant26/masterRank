import React, {
  Component
} from 'react';

import { Redirect } from 'react-router'

import UserCard from '../../UserCard/UserCard';

export default class UserButton extends Component {

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

    //TODO: should I be making a token?
    this.props.updateUserAction(this.props.user);
  }

  render() {
    return (
        <div>
            { this.state.fireRedirect
                ? ( <Redirect to='/' /> )
                : ( <button onClick={this.handleClick}>
                        <UserCard user={this.props.user} />
                    </button>)
            }
        </div>
    );
  }
}
