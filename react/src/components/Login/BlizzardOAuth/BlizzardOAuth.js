import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {pushBlockingEvent as pushBlockingEventAction} from '../../../actions/loading';

const BlizzardOAuth = ({region, setLoading}) => {

    function onClick() {
        setLoading();
        window.location.assign(redirectBlizzardAuthUrl());
    }

    function redirectBlizzardAuthUrl() {
        return `/auth/bnet/callback?region=${region}`;
    }

    return(
        <button className="BlizzardOAuth button-primary" onClick={onClick}>
            <div className="button-content">
                LOGIN VIA BATTLE.NET
            </div>
        </button>
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