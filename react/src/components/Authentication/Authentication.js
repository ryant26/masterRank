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

const deleteCookie = (name) => {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

class Authentication extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accessToken: getCookie('access_token'),
        };
    }

    componentWillMount() {
        let accessToken = this.state.accessToken;

        if (accessToken) {
            deleteCookie('access_token');
            localStorage.setItem('accessToken', accessToken);
            let decodedToken = decode(accessToken);
            fetch(this.urlForUserSearch(decodedToken))
                .then(response => {
                  if (!response.ok) {
                    throw Error("Network request failed");
                  }

                  return response;
                })
                .then(response => response.json())
                .then(response => {
                    this.props.updateUserAction(response);
                })
                .catch((error) => {
                    throw error;
                });
        }
    }

    urlForUserSearch(token) {
        let platformDisplayName = encodeURIComponent(token.platformDisplayName);
        return `/api/players?platformDisplayName=${platformDisplayName}&platform=${token.platform}&region=${token.region}`;
    }

    render() {
        return (!this.state.accessToken && <LoginPage /> );
    }
}

Authentication.propTypes = {
    updateUserAction: PropTypes.func.isRequired
};

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    updateUserAction: updateUserAction,
  }, dispatch);
};

export default connect(null, mapDispatchToProps)(Authentication);