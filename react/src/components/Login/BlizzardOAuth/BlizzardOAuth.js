import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pushBlockingEvent as pushBlockingEventAction } from 'actionCreators/loading';
import { startLoginTrackingEvent } from 'actionCreators/googleAnalytic/googleAnalytic';

import LoginFailedCard from 'components/Login/LoginFailedCard/LoginFailedCard';

const BlizzardOAuth = ({region, platform, dispatchStartLoginTrackingEvent, setLoading}) => {

    function onClick() {
        dispatchStartLoginTrackingEvent(platform);
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
    platform: PropTypes.string.isRequired,
    dispatchStartLoginTrackingEvent:  PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        dispatchStartLoginTrackingEvent: startLoginTrackingEvent,
        setLoading: pushBlockingEventAction
    }, dispatch);
};

export default connect(null, mapDispatchToProps)(BlizzardOAuth);