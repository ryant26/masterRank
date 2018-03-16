import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {logout as logoutAction} from "../../../../actionCreators/app";
import { clearAccessToken } from '../../../../utilities/localStorage/localStorageUtilities';
import { home } from '../../../Routes/links';

const LogoutButton = ({onLogout}) => {

    function onClick() {
        onLogout();
        clearAccessToken();
        window.location.assign(home);
    }

    return (
        <a className="LogoutButton" onClick={onClick}>
            Logout
        </a>
    );
};

LogoutButton.propTypes = {
    onLogout: PropTypes.func.isRequired
};

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        onLogout: logoutAction,
    }, dispatch);
};

export default connect(null, mapDispatchToProps)(LogoutButton);