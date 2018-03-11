import React, { Component } from 'react';
import JoyRide from 'react-joyride';

export default class Walkthrough extends Component {

    constructor() {
        super();
        this.state = {
            startWalkthrough: false
        };

        this.startWalkthrough = this.startWalkthrough.bind(this);
        setTimeout(this.startWalkthrough, 2000);
    }

    startWalkthrough() {
        this.setState({
            startWalkthrough: true
        });
    }

    render() {
        const steps = [
            {
                title: 'Preferred Heroes',
                text: 'These hero icons represent the heroes you are willing to play in-game. We\'ve selected your top 5 based on playtime. You can change them at any time by clicking on any hero icon.',
                selector: '.PreferredHeroes-HeroList',
                position: 'right'
            },
            {
                title: 'Invites',
                text: 'When you receive group invites they will show up here',
                selector: '.InvitesCard',
                position: 'right'
            },
            {
                title: 'Your Group',
                text: 'This area shows the members and pending members of your group',
                selector: '.GroupContainer',
                position: 'right'
            },
            {
                title: 'People Looking For Group',
                text: 'Everyone who is looking for a group will show up here.',
                selector: '.HeroRolesContainer',
                position: 'top'
            },
            {
                title: 'Invite Player To Your Group',
                text: 'Click on the hero icon to invite this player to your group.',
                selector: '.invitePlayerButton:nth-child(1)', position: 'bottom',
                allowClicksThruHole: true
            },
        ];

        return (
            <JoyRide
                ref="joyride"
                steps={steps}
                run={this.state.startWalkthrough}
                autoStart={true}
                showSkipButton={true}
                type={'continuous'}
            />
        );
    }
}