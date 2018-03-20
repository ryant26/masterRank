import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { feedback } from '../../../Routes/links';
import { clickFeedbackTrackingEvent } from '../../../../actionCreators/googleAnalytic/googleAnalytic';

const FeedbackButton = ({ onClickFeedback }) => {

    function onClick() {
        onClickFeedback();
        window.location.assign(feedback);
    }

    return (
        <a className="FeedbackButton" onClick={onClick}>
            Feedback
        </a>
    );
};

FeedbackButton.propTypes = {
    onClickFeedback: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        onClickFeedback: clickFeedbackTrackingEvent
    }, dispatch);
};

export default connect(null, mapDispatchToProps)(FeedbackButton);