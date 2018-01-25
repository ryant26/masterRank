import React, {
  Component
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import UserCard from '../../UserCard/UserCard';
import {updateUser as updateUserAction} from "../../../actions/user";

class UserButton extends Component {

  constructor(props){
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.redirectUrl = this.redirectUrl.bind(this);
  }

  handleClick(){
    //TODO: Decided when and where to move cookie token to local storage
    let user = this.props.user;
    this.props.updateUserAction(user);
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
            </button>)
        </div>
    );
  }
}

UserButton.propTypes = {
    user: PropTypes.object.isRequired,
    updateUserAction: PropTypes.func.isRequired
};

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    updateUserAction: updateUserAction,
  }, dispatch);
};

export default connect(null, mapDispatchToProps)(UserButton);