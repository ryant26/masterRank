import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { startWalkthrough } from 'actionCreators/walkthrough/walkthrough';

const TutorialButton = ({ onStartTutorial, platformDisplayName }) => {

    const onClick = () => {
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
    onStartTutorial: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        platformDisplayName: state.user.platformDisplayName
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        onStartTutorial: startWalkthrough,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TutorialButton);