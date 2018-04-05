import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { feedback } from 'components/Routes/links';
import { clickFeedbackTrackingEvent } from 'actionCreators/googleAnalytic/googleAnalytic';

const FeedbackButton = ({ trackFeedback, platformDisplayName }) => {

    function onClick() {
        trackFeedback(platformDisplayName);
        window.location.assign(feedback);
    }

    return (
        <a className="FeedbackButton" onClick={onClick}>
            Feedback
        </a>
    );
};

FeedbackButton.propTypes = {
    platformDisplayName: PropTypes.string.isRequired,
    trackFeedback: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        platformDisplayName: state.user.platformDisplayName
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        trackFeedback: clickFeedbackTrackingEvent
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackButton);