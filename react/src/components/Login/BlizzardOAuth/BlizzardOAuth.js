import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pushBlockingEvent as pushBlockingEventAction } from 'actionCreators/loading';
import { signInTrackingEvent } from 'actionCreators/googleAnalytic/googleAnalytic';

import SiteInformation from 'components/Login/SiteInformation/SiteInformation';
import ScrollButton from 'components/Login/SiteInformation/ScrollButton/ScrollButton';
import LoginFailedCard from 'components/Login/LoginFailedCard/LoginFailedCard';

class BlizzardOAuth extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };

        this.onClick = this.onClick.bind(this);
        this.redirectBlizzardAuthUrl = this.redirectBlizzardAuthUrl.bind(this);
    }

    onClick() {
        this.props.trackSignIn(this.props.platform);
        this.props.setLoading();
        this.setState({
            isLoading: true
        });
        window.location.assign(this.redirectBlizzardAuthUrl());
    }

    redirectBlizzardAuthUrl() {
        return `/auth/bnet/callback?region=${this.props.region}`;
    }

    render() {
        return(
            <div className="BlizzardOAuth flex flex-column align-center grow">
                <button className="button-primary flex align-center justify-center" disabled={this.props.disabled} onClick={this.onClick}>
                    <div className="button-content">
                        LOGIN VIA BATTLE.NET
                    </div>
                </button>
                <LoginFailedCard/>
                {!this.state.isLoading &&
                    <ScrollButton/>
                }
                {!this.state.isLoading &&
                    <SiteInformation/>
                }
            </div>
        );
    }
}

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