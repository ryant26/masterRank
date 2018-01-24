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
    //TODO: implement Blizzard endpoint /auth/bnet?region={region}
    //TODO: Still not sure how you want this user to be set. token
    let user = this.props.user;
    this.props.updateUserAction(user);
    window.location.assign(this.redirectUrl());
  }

  //TODO: what do I do with the callback https://localhost:3002/auth/bnet/callback?region=us&code=68tr9t6samjgrznzng89d7su
  redirectUrl() {
    //TODO: Bnet still shows our app as MasterRank (Blizzards end)
    //TODO: how should i be getting region? it is not a part of the user obj returned when I search
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