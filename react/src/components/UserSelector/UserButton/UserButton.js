import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';

import UserCard from '../../UserCard/UserCard';

export default class UserButton extends Component {

  constructor(props){
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.redirectUrl = this.redirectUrl.bind(this);
  }

  handleClick(){
    window.location.assign(this.redirectUrl());
  }

  redirectUrl() {
    //TODO: Bnet still shows our app as MasterRank (Blizzards end)
    //TODO: Decide what to do about region and unhard code "us" here
    return `/auth/bnet/callback?region=us`;
  }

  render() {
    return (
        <div className="UserButton">
            <button onClick={this.handleClick}>
                <UserCard user={this.props.user} />
            </button>
        </div>
    );
  }
}

UserButton.propTypes = {
    user: PropTypes.object.isRequired,
};