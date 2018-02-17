import React, {
  Component
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';

import LoginPage from '../../../pages/LoginPage/LoginPage';
import {updateUser as updateUserAction} from "../../../actionCreators/user";
import { home } from '../../Routes/links';

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
                .then(user => {
                    this.props.updateUserAction(user);
                    deleteCookie('access_token');
                });
        }
    }

    urlForUserSearch(token) {
        let encodedDisplayName = encodeURIComponent(token.platformDisplayName);
        return `/api/players?platformDisplayName=${encodedDisplayName}&platform=${token.platform}&region=${token.region}`;
    }

    render() {
        return (
            <div className="Authentication flex grow">
                { !this.state.accessToken
                    ? <LoginPage/>
                    : <Redirect to={home}/>
                }
            </div>
        );
    }
}

Authentication.propTypes = {
    updateUserAction: PropTypes.func.isRequired,
};

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    updateUserAction: updateUserAction,
  }, dispatch);
};

export default connect(null, mapDispatchToProps)(Authentication);