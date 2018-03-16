import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import JoyRide from 'react-joyride';
import PropTypes from 'prop-types';

import { finishWalkthrough } from '../../actionCreators/walkthrough/walkthrough';

class Walkthrough extends Component {

    constructor(props) {
        super(props);

        this.walkthroughCallback = this.walkthroughCallback.bind(this);
    }

    walkthroughCallback (event) {
        if(event.type === 'finished') {
            this.props.finishWalkthrough(this.props.platformDisplayName);
        }
    }

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
                text: 'Filter the lists below by Hero. For instance, if you select mercy, only players willing to play mercy will show up',
                selector: '.HeroSelector',
                position: 'bottom',
                allowClicksThruHole: true
            },
        ];

        let joyride = null;
        if(this.props.runWalkthrough) {
            joyride = (
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
        return ( joyride );
    }
}

Walkthrough.propTypes = {
    runWalkthrough: PropTypes.bool.isRequired,
    finishWalkthrough: PropTypes.func.isRequired,
    platformDisplayName: PropTypes.string.isRequired
};

const mapStateToProps = (state) => {
    const platformDisplayName = state.user.platformDisplayName;
    return {
        runWalkthrough:  state.loading.blockUI === 0 && !state.walkthrough.finished[platformDisplayName],
        platformDisplayName
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        finishWalkthrough: finishWalkthrough
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Walkthrough);