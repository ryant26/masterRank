import React, { Component } from 'react';
import HeroImage from '../../../HeroImage/HeroImage';
import PropTypes from 'prop-types';

const classNames = require('classnames');

export default class GroupHeroCard extends Component {

    constructor(props) {
        super(props); 
        this.state = {
             count: props.count
        };
        this.pending = props.pending;
        this.leader = props.leader;
        this.oldFuck = props.userName;
    }

    componentDidMount() {
        if (this.pending) {
            this.timer = setInterval(this.tick.bind(this), 1000);
        }
    }

    shouldComponentUpdate() {
        if (this.props.userName != this.oldFuck) {
            this.oldFuck = this.props.userName;
            this.setState({count: (this.props.count)});
            return false;
        }
        return true;
    }

    componentWillUnmount () {
        clearInterval(this.timer);
    }

    tick () {
        this.setState({count: (this.state.count - 1)});            
        this.props.parentTick(this.props.hero, this.state.count);
    }

    render() {
        let hero = this.props.hero;
        let number = this.props.number;        
        let userName = this.props.userName;
        let isPending = this.props.pending;
        let leader = this.props.leader;
        let userText;

        const classses = classNames({
            overlay: true,
            pending: this.props.pending
        });
        
        if (leader) {
            userName = userName + ' - Leader';
            userText = (
                <div className="imageStylePadding">
                    <div className="flex justify-between">
                        {userName}   
                    </div>
                    <div className="inLine1">
                        <div>{hero.heroName}</div>
                    </div>
                </div>
            );
        }

        if (isPending) {
            userName = userName + ' - Pending';
            userText = (
                <div className="imageStylePadding">
                    <div className="flex justify-between">
                        {userName}   
                    </div>
                    <div className="inLine1">
                        <div>{hero.heroName}</div>
                    </div>
                </div>
            );
        }
    
        return (
            <div className="GroupHeroCard flex align-center">
                <div className="numberBox flex align-center sidebar-title numbers">{number}</div>
                <div className="countdownTimer">
                    <HeroImage className="HeroImage" heroName={hero.heroName}/>
                    <div className={classses}>
                        <div className="countdown-container flex align-center justify-center" onClick={this.invitePlayer}>
                            <div>{this.state.count}</div>
                        </div>
                    </div>
                </div>
                {userText}
            </div>
        );
    }
}

GroupHeroCard.propTypes = {
    hero: PropTypes.shape({
        heroName: PropTypes.string
    }),
    number: PropTypes.number,
    userName: PropTypes.string,
    pending: PropTypes.bool,
    leader: PropTypes.bool,
    count: PropTypes.number,
    parentTick: PropTypes.function
};