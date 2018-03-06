import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {pushBlockingEvent as pushBlockingEventAction} from '../../../actionCreators/loading';

import LoginFailedCard from '../LoginFailedCard/LoginFailedCard';

const BlizzardOAuth = ({region, setLoading}) => {

    function onClick() {
        setLoading();
        window.location.assign(redirectBlizzardAuthUrl());
    }

    function redirectBlizzardAuthUrl() {
        return `/auth/bnet/callback?region=${region}`;
    }

    return(
        <div className="BlizzardOAuth flex flex-column align-center">
            <div className="button-primary flex align-center justify-center" onClick={onClick}>
                <div className="button-content">
                    LOGIN VIA BATTLE.NET
                </div>
            </div>
            <LoginFailedCard/>
        </div>
    );
};

BlizzardOAuth.propTypes = {
    region: PropTypes.string.isRequired,
    setLoading: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setLoading: pushBlockingEventAction
    }, dispatch);
};

export default connect(null, mapDispatchToProps)(BlizzardOAuth);