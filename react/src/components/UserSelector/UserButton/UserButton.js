import React, {
  Component
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';

import UserCard from '../../UserCard/UserCard';
import {updateUser as updateUserAction} from "../../../actions/user";

class UserButton extends Component {

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

    //TODO: implement Blizzard endpoint /auth/bnet
    this.props.updateUserAction(this.props.user);
  }

  render() {
    return (
        <div className="UserButton">
            { this.state.fireRedirect
                ? ( <Redirect to="/" /> )
                : ( <button onClick={this.handleClick}>
                        <UserCard user={this.props.user} />
                    </button>)
            }
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