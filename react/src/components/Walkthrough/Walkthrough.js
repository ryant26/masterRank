import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import JoyRide from 'react-joyride';
import PropTypes from 'prop-types';

import { finishedWalkthrough } from '../../actionCreators/walkthrough/walkthrough';

class Walkthrough extends Component {

    constructor(props) {
        super(props);

        this.walkthroughCallback = this.walkthroughCallback.bind(this);
    }

    walkthroughCallback (event) {
        if(event.type === 'finished') {
            this.props.finishedWalkthrough();
        }
    }

    //TODO: when you refresh joyride-overlay is enabled, why?
    render() {
        const steps = [
            {
                title: 'Preferred Heroes',
                text: 'These hero icons represent the heroes you are willing to play in-game. We\'ve selected your 5 most played heroes. You can change them at any time by clicking on the hero icons.',
                selector: '.PreferredHeroes-HeroList',
                position: 'right'
            },
            {
                title: 'Players Currently Looking For a Group',
                text: 'All players currently looking for a group will show up here.',
                selector: '.HeroRolesContainer',
                position: 'top'
            },
            {
                title: 'Invite Player to Your Group',
                text: 'Click on the hero icon to invite player to your group.',
                selector: '.invitePlayerButton:nth-child(1)',
                position: 'bottom',
                allowClicksThruHole: true
            },
            {
                title: 'Filter Players by Hero',
                text: 'Filter players by the heroes they are willing to play. For instance, if you select mercy, only players willing to play mercy will show up',
                selector: '.HeroSelector',
                position: 'bottom',
                allowClicksThruHole: true
            },
        ];

        return (
            <JoyRide
                ref="joyride"
                steps={steps}
                run={this.props.runWalkthrough}
                autoStart={true}
                showSkipButton={true}
                showStepsProgress={true}
                type={'continuous'}
                callback={this.walkthroughCallback}
            />
        );
    }
}

Walkthrough.propTypes = {
    runWalkthrough: PropTypes.bool.isRequired,
    finishedWalkthrough: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        runWalkthrough: state.walkthrough === 'run'
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        finishedWalkthrough: finishedWalkthrough
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Walkthrough);