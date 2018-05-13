import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pushBlockingEvent as pushBlockingEventAction } from 'actionCreators/loading';
import { signInTrackingEvent } from 'actionCreators/googleAnalytic/googleAnalytic';

import SiteInformation from 'components/Login/SiteInformation/SiteInformation';
import ScrollButton from 'components/Login/SiteInformation/ScrollButton/ScrollButton';
import LoginFailedCard from 'components/Login/LoginFailedCard/LoginFailedCard';

const BlizzardOAuth = ({region, platform, disabled, trackSignIn, setLoading}) => {

    function onClick() {
        trackSignIn(platform);
        setLoading();
        window.location.assign(redirectBlizzardAuthUrl());
    }

    function redirectBlizzardAuthUrl() {
        return `/auth/bnet/callback?region=${region}`;
    }

    return(
        <div className="BlizzardOAuth flex flex-column align-center grow">
            <button className="button-primary flex align-center justify-center" disabled={disabled} onClick={onClick}>
                <div className="button-content">
                    LOGIN VIA BATTLE.NET
                </div>
            </button>
            <LoginFailedCard/>
            <ScrollButton/>
            <SiteInformation/>
        </div>
    );
};

BlizzardOAuth.propTypes = {
    region: PropTypes.string.isRequired,
    platform: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    trackSignIn:  PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        trackSignIn: signInTrackingEvent,
        setLoading: pushBlockingEventAction
    }, dispatch);
};

export default connect(null, mapDispatchToProps)(BlizzardOAuth);