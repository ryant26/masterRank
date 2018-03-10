import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { home } from '../../../Routes/links';
import {logout as logoutAction} from "../../../../actionCreators/app";

const LogoutButton = ({logout}) => {

    function onClick() {
        logout();
        localStorage.clear();
        window.location.assign(home);
    }

    return (
        <a className="LogoutButton" onClick={onClick}>
            Logout
        </a>
    );
};

LogoutButton.propTypes = {
    logout: PropTypes.func.isRequired
};

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        logout: logoutAction,
    }, dispatch);
};

export default connect(null, mapDispatchToProps)(LogoutButton);