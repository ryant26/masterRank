import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { feedback } from 'components/Routes/links';
import { clickFeedbackTrackingEvent } from 'actionCreators/googleAnalytic/googleAnalytic';

const FeedbackButton = ({ dispatchFeedbackTrackingEvent }) => {

    function onClick() {
        dispatchFeedbackTrackingEvent();
        window.location.assign(feedback);
    }

    return (
        <a className="FeedbackButton" onClick={onClick}>
            Feedback
        </a>
    );
};

FeedbackButton.propTypes = {
    dispatchFeedbackTrackingEvent: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        dispatchFeedbackTrackingEvent: clickFeedbackTrackingEvent
    }, dispatch);
};

export default connect(null, mapDispatchToProps)(FeedbackButton);