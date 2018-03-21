import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { startWalkthrough } from 'actionCreators/walkthrough/walkthrough';
import { clickTutorialTrackingEvent } from 'actionCreators/googleAnalytic/googleAnalytic';

const TutorialButton = ({ dispatchTutorialTrackingEvent, onStartTutorial, platformDisplayName }) => {

    const onClick = () => {
        dispatchTutorialTrackingEvent();
        onStartTutorial(platformDisplayName);
    };

    return (
        <a className="TutorialButton" onClick={onClick}>
            Tutorial
        </a>
    );
};

TutorialButton.propTypes =  {
    platformDisplayName: PropTypes.string.isRequired,
    onStartTutorial: PropTypes.func.isRequired,
    dispatchTutorialTrackingEvent: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    return {
        platformDisplayName: state.user.platformDisplayName
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        onStartTutorial: startWalkthrough,
        dispatchTutorialTrackingEvent: clickTutorialTrackingEvent
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TutorialButton);