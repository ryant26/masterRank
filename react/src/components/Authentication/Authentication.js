import React, {
  Component
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoginPage from '../../pages/LoginPage/LoginPage';

import {updateUser as updateUserAction} from "../../actions/user";

const decode  = require('jwt-decode');

const getCookie = (name) => {
    let cookieNameMatcher = new RegExp("(?:(?:^|.*;*)" + name + "*=*([^;]*).*$)|^.*$");
    let cookieValue = document.cookie.replace(cookieNameMatcher, "$1");
    return cookieValue;
};

class Callback extends Component {
    //TODO: Is there a reason to not just store the token straight to local storage?
    constructor(props) {
        super(props);
        this.state = {
            accessToken: getCookie('access_token'),
        };
    }

    componentWillMount() {
        let accessToken = this.state.accessToken;

        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
            //TODO: figure out how to delete a cookie
            let decodedToken = decode(accessToken);
            fetch(this.urlForUserSearch(decodedToken.platformDisplayName))
                .then(response => {
                  if (!response.ok) {
                    throw Error("Network request failed");
                  }

                  return response;
                })
                .then(response => response.json())
                .then(response => {
                    this.props.updateUserAction(response[0]);
                });
        }
    }

    urlForUserSearch(displayName) {
        return `/api/players/search?platformDisplayName=${displayName}`;
    }

    render() {
        return (!this.state.accessToken && <LoginPage /> );
    }
}

Callback.propTypes = {
    updateUserAction: PropTypes.func.isRequired
};

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    updateUserAction: updateUserAction,
  }, dispatch);
};

export default connect(null, mapDispatchToProps)(Callback);